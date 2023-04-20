import config from "../../../config.js";
import { parseCommandLine } from "./parser.js";
test("parseCommandLine", () => {
    const tests = [
        {
            in: "[2023-04-01 10:11] !INIT           performed by 'TAG name': ",
            out: {
                "date": new Date("2023-04-01T10:11:00.000" + config.timezone),
                "body": "",
                "command": "INIT",
                "issuer": {
                    "name": "name",
                    "tag": "TAG",
                    "typ": 0,
                },
            }
        }, {
            in: "[2023-04-14 20:23] !REPORT         performed by ' Shil': dont switch!",
            out: {
                "body": "dont switch!",
                "command": "REPORT",
                "issuer": {
                    "name": "Shil",
                    "typ": 0,
                },
                "date": new Date("2023-04-14T20:23:00.000" + config.timezone),
            }
        }, {
            in: "[2023-04-01 15:30] MAPVOTERESULT   performed by '[POV] ARC*fecht_niko': Vote finished: Aas: 32 | Ins: 11",
            out: {
                "body": "Vote finished: Aas: 32 | Ins: 11",
                "command": "MAPVOTERESULT",
                "date": new Date("2023-04-01T15:30:00.000" + config.timezone),
                "issuer": {
                    "name": "ARC*fecht_niko",
                    "tag": "[POV]",
                    "typ": 0,
                },
            },
        }
    ];
    tests.forEach(t => {
        expect(parseCommandLine(t.in)).toEqual(t.out);
    });
});
