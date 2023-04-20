import config from "../../config.js";
import { parseBanLine } from "./bans.js";
test("parseBanLine", () => {
    const tests = [
        {
            in: "[2023-04-02 21:13] c0b528173cd34eb6978f594b034f66e5  User 192.168.24.61 No mic! We advise you to get the WO MIC app on your phone and connect it to your PC, google it for more info! banned by [POV] Oblivium (10800)",
            out: {
                "issuer": {
                    "name": "Oblivium",
                    "tag": "[POV]",
                    "typ": 0,
                },
                "receiver": {
                    "hash": "c0b528173cd34eb6978f594b034f66e5",
                    "ip": "192.168.24.61",
                    "name": "User",
                    "tag": "",
                    "typ": 0,
                },
                "date": new Date("2023-04-02T21:13:00.000" + config.timezone),
                "duration": 10800,
                "body": "No mic! We advise you to get the WO MIC app on your phone and connect it to your PC, google it for more info!",
            }
        }, {
            in: "[2023-04-02 20:34] c79068163db043379abacb66ed6ab6df [TAG] some_user 192.168.240.229 No mic! We advise you to get the WO MIC app on your phone and connect it to your PC, google it for more info! banned by KIA rPoXoTauJIo (10800)",
            out: {
                "body": "No mic! We advise you to get the WO MIC app on your phone and connect it to your PC, google it for more info!",
                "date": new Date("2023-04-02T20:34:00.000" + config.timezone),
                "duration": 10800,
                "issuer": {
                    "name": "rPoXoTauJIo",
                    "tag": "KIA",
                    "typ": 0,
                },
                "receiver": {
                    "hash": "c79068163db043379abacb66ed6ab6df",
                    "ip": "192.168.240.229",
                    "name": "some_user",
                    "tag": "[TAG]",
                    "typ": 0,
                },
            }
        }
    ];
    tests.forEach(t => {
        expect(parseBanLine(t.in)).toEqual(t.out);
    });
});
