import MISTWEAVER_MONK from "@data/specs/monk/mistweaver";
import { bugExportCsv } from "@util/bugExportRows";

export const dynamic = "force-static";

// pulled into the bugs google sheet with IMPORTDATA
export function GET() {
    return new Response(bugExportCsv(MISTWEAVER_MONK.bugs), {
        headers: { "Content-Type": "text/csv; charset=utf-8" },
    });
}
