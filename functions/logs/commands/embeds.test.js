import { prepareEmbeds } from "./embeds.js";

test("processCommand", () => {
    const tests = [
        {
            in: "[2023-04-02 11:08] !INIT           performed by '[POV] DusanYUgoslavia':",
            out: {
                "priv": {
                    "color": 7419530,
                    "description": "**Performed by: **`[POV] DusanYUgoslavia`\nAdminhashes and -powerlevels have been reloaded",
                    "footer": {
                        "icon_url": undefined,
                        "text": "IN-GAME",
                    },
                    "timestamp": "2023-04-14T14:49:05.974Z",
                    "title": "INIT",
                }
            }
        }, {
            in: "[2023-04-02 11:12] !KICK           performed by 'SERVER' on 'BOCXOD Zich': Unassigned AFK",
            out: {
                "priv": {
                    "color": 7419530,
                    "description": "**Performed by: **`[POV] DusanYUgoslavia`\nAdminhashes and -powerlevels have been reloaded",
                    "footer": {
                        "icon_url": undefined,
                        "text": "IN-GAME",
                    },
                    "timestamp": "2023-04-14T14:49:05.974Z",
                    "title": "INIT",
                }
            }
        }, {
            in: "[2023-04-14 16:56] !KICK           performed by 'PRISM user Tommy_Bot' on ' cassius23': test - Discord User cassius23",
            out: {}
        }, {
            in: "[2023-04-14 17:34] !REPORT         performed by '[POV] DusanYUgoslavia': yess",
            out: {}
        }, {
            in: "[2023-04-14 17:43] !MESSAGE        performed by ' cassius23' on '[POV] DusanYUgoslavia': test -  cassius23",
            out: {}
        }, {
            in: "[2023-04-14 18:15] !REPORT         performed by ' 'Kebabtime'': tk",
            out: {}
        }
    ];

    tests.forEach(t => {
        expect(prepareEmbeds(t.in)).toEqual(t.out);
    });
});
