import { parseBanLine } from "./bans.js";

test("parseBanLine", () => {
    const tests = [
        {
            in: "[2023-04-02 21:13] b0b528173cd34eb6978f594b034f66e5  XaJlk 37.214.24.61 No mic! We advise you to get the WO MIC app on your phone and connect it to your PC, google it for more info! banned by [POV] Oblivium (10800)",
            out: {
                "issuer": {
                    "name": "Oblivium",
                    "tag": "[POV]",
                    "typ": 0,
                },
                "duration": "3 Hours",
                "receiver": {
                    "hash": "b0b528173cd34eb6978f594b034f66e5",
                    "ip": "37.214.24.61",
                    "name": "XaJlk",
                    "tag": "",
                    "typ": 0,
                },
                "date": new Date("2023-04-02T19:13:00.000Z"),
                "duration": 10800,
                "body": "No mic! We advise you to get the WO MIC app on your phone and connect it to your PC, google it for more info!",
            }
        }, {
            in: "[2023-04-02 20:34] e79068163db043379abacb66ed6ab6df [UCL] ded_cres 178.54.240.229 No mic! We advise you to get the WO MIC app on your phone and connect it to your PC, google it for more info! banned by KIA rPoXoTauJIo (10800)",
            out: {
                "body": "No mic! We advise you to get the WO MIC app on your phone and connect it to your PC, google it for more info!",
                "date": new Date("2023-04-02T18:34:00.000Z"),
                "duration": 10800,
                "issuer": {
                    "name": "rPoXoTauJIo",
                    "tag": "KIA",
                    "typ": 0,
                },
                "receiver": {
                    "hash": "e79068163db043379abacb66ed6ab6df",
                    "ip": "178.54.240.229",
                    "name": "ded_cres",
                    "tag": "[UCL]",
                    "typ": 0,
                },
            }
        }
    ];

    tests.forEach(t => {
        expect(parseBanLine(t.in)).toEqual(t.out);
    });
});
