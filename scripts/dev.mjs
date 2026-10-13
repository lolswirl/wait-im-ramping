import { exec, spawn } from "node:child_process";

const dev = spawn("next dev --turbopack", {
    shell: true,
    stdio: ["inherit", "pipe", "inherit"],
    env: { ...process.env, FORCE_COLOR: "1" },
});

let opened = false;

dev.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
    if (opened) return;
    const url = chunk.toString().match(/http:\/\/localhost:\d+/);
    if (url) {
        opened = true;
        exec(`start ${url[0]}`);
    }
});

dev.on("exit", (code) => process.exit(code ?? 0));
