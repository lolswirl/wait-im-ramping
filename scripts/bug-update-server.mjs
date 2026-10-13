// local helper for the bugs page "Update Bugs" workflow: applies review decisions to the bugs.tsx files on disk
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const PORT = 3111;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SPEC_KEY = /^[a-z]+_[a-z]+$/;
const BUILD = /^[\d.]+$/;
const STATUS = /^[A-Za-z]+$/;
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const parse = (file) => {
    const text = fs.readFileSync(path.join(ROOT, file), "utf8");
    return { text, sourceFile: ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX) };
};

const findProperty = (node, name) => {
    if (ts.isPropertyAssignment(node) && node.name.getText() === name) return node;
    return ts.forEachChild(node, child => findProperty(child, name));
};

const findBugsArray = (sourceFile) => {
    for (const statement of sourceFile.statements) {
        if (!ts.isVariableStatement(statement)) continue;
        for (const declaration of statement.declarationList.declarations) {
            if (declaration.name.getText() === "BUGS" && declaration.initializer && ts.isArrayLiteralExpression(declaration.initializer)) {
                return declaration.initializer;
            }
        }
    }
    throw new Error(`${sourceFile.fileName}: could not find the BUGS array`);
};

// reads the spec's `bugs:` entry (X or X.concat(Y, ...)) and follows the imports, giving the bugs files in list order
const findBugFiles = (specKey) => {
    if (!SPEC_KEY.test(specKey)) throw new Error(`invalid spec: ${specKey}`);

    const specFile = `src/data/specs/${specKey.replace("_", "/")}/index.ts`;
    const { sourceFile } = parse(specFile);
    const bugs = findProperty(sourceFile, "bugs")?.initializer;
    if (!bugs) throw new Error(`${specFile}: no bugs entry`);

    const isConcat = ts.isCallExpression(bugs) && ts.isPropertyAccessExpression(bugs.expression) && bugs.expression.name.text === "concat";
    const lists = isConcat ? [bugs.expression.expression, ...bugs.arguments] : [bugs];

    return lists.map(list => {
        const imported = sourceFile.statements.find(statement =>
            ts.isImportDeclaration(statement) && statement.importClause?.name?.text === list.getText());
        if (!imported) throw new Error(`${specFile}: could not resolve ${list.getText()}`);
        return imported.moduleSpecifier.text.replace("@data/", "src/data/") + ".tsx";
    });
};

const applyUpdates = (specKey, updates) => {
    let offset = 0;
    return findBugFiles(specKey).map(file => {
        const { text, sourceFile } = parse(file);
        const newline = text.includes("\r\n") ? "\r\n" : "\n";
        const bugs = findBugsArray(sourceFile).elements;
        const edits = [];

        for (const { index, build, status } of updates) {
            const bug = bugs[index - offset];
            if (index < offset || !bug) continue;
            if (build && !BUILD.test(build)) throw new Error(`invalid build: ${build}`);
            if (status && !STATUS.test(status)) throw new Error(`invalid status: ${status}`);

            if (build) {
                const buildsTested = findProperty(bug, "buildsTested").initializer;
                const builds = buildsTested.elements;
                if (!builds.some(existing => existing.text === build)) {
                    edits.push(builds.length > 0
                        ? { pos: builds[builds.length - 1].getEnd(), end: builds[builds.length - 1].getEnd(), text: `, "${build}"` }
                        : { pos: buildsTested.getEnd() - 1, end: buildsTested.getEnd() - 1, text: `"${build}"` });
                }
            }

            if (status) {
                const value = `STATUS.${status.toUpperCase()}`;
                const existing = bug.properties.find(property => property.name?.getText() === "status");
                if (existing) {
                    edits.push({ pos: existing.initializer.getStart(), end: existing.initializer.getEnd(), text: value });
                } else {
                    const last = bug.properties[bug.properties.length - 1];
                    const lineStart = text.lastIndexOf("\n", last.getStart()) + 1;
                    const indent = text.slice(lineStart, last.getStart());
                    edits.push({ pos: last.getEnd(), end: last.getEnd(), text: `,${newline}${indent}status: ${value}` });
                }
            }
        }

        offset += bugs.length;

        let result = text;
        for (const edit of edits.sort((a, b) => b.pos - a.pos)) {
            result = result.slice(0, edit.pos) + edit.text + result.slice(edit.end);
        }
        return { file, result, changed: edits.length > 0 };
    });
};

const server = http.createServer((req, res) => {
    const origin = req.headers.origin ?? "";
    if (!LOCAL_ORIGIN.test(origin)) {
        res.writeHead(403).end();
        return;
    }
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204).end();
        return;
    }
    if (req.method !== "POST" || req.url !== "/update") {
        res.writeHead(404).end();
        return;
    }

    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
        try {
            const { spec, updates } = JSON.parse(body);
            const writes = applyUpdates(spec, updates).filter(write => write.changed);
            for (const { file, result } of writes) {
                fs.writeFileSync(path.join(ROOT, file), result);
            }
            res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ files: writes.map(write => write.file) }));
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" }).end(JSON.stringify({ error: error.message }));
        }
    });
});

server.listen(PORT, "127.0.0.1", () => {
    console.log(`bug update server listening on http://localhost:${PORT}`);
});
