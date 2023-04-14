import { parseBanLine } from "./bans";

test("parseBanLine", () => {
    const tests = [
        {
            in: "[2023-04-02 21:13] b0b528173cd34eb6978f594b034f66e5  XaJlk 37.214.24.61 No mic! We advise you to get the WO MIC app on your phone and connect it to your PC, google it for more info! banned by [POV] Oblivium (10800)",
            out: {
                "admin": "[POV] Oblivium",
                "duration": "3 Hours",
                "hash": "b0b528173cd34eb6978f594b034f66e5",
                "ip": "37.214.24.61",
                "name": "XaJlk",
                "reason": "No mic! We advise you to get the WO MIC app on your phone and connect it to your PC, google it for more info! ",
                "tag": "",
            }
        }, {
            in: "[2023-04-02 20:34] e79068163db043379abacb66ed6ab6df [UCL] ded_cres 178.54.240.229 No mic! We advise you to get the WO MIC app on your phone and connect it to your PC, google it for more info! banned by KIA rPoXoTauJIo (10800)",
            out: {
                "admin": "KIA rPoXoTauJIo",
                "duration": "3 Hours",
                "hash": "e79068163db043379abacb66ed6ab6df",
                "ip": "178.54.240.229",
                "name": "ded_cres",
                "reason": "No mic! We advise you to get the WO MIC app on your phone and connect it to your PC, google it for more info! ",
                "tag": "[UCL]",
            }
        }
    ];

    tests.forEach(t => {
        expect(parseBanLine(t.in)).toEqual(t.out);
    });
});
