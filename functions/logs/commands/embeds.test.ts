import { prepareEmbeds } from "./embeds.js";
import { parseCommandLine } from "./parser.js";

test("processCommand", () => {
    const tests = [
        {
            in: "[2023-04-01 15:12] !INIT           performed by '[POV] DusanYUgoslavia': ",
            out: {
                "priv": {
                    "data": {
                        "color": 7419530,
                        "description": "**Performed by: **`[POV] DusanYUgoslavia`\nAdminhashes and -powerlevels have been reloaded",
                        "footer": {
                            "icon_url": undefined,
                            "text": "IN-GAME",
                        },
                        "timestamp": "2023-04-01T13:12:00.000Z",
                        "title": "INIT",
                    }
                }
            }
        }, {
            in: "[2023-04-02 11:12] !KICK           performed by 'SERVER' on 'BOCXOD Zich': Unassigned AFK",
            out: {
                "priv": {
                    "data": {
                        "color": 11027200,
                        "description": "**Performed by: **`SERVER`\n**On user: ** `BOCXOD Zich`\n**Reason : **`Unassigned AFK`",
                        "timestamp": "2023-04-02T09:12:00.000Z",
                        "title": "KICK",
                    }
                },
                "pub": {
                    "data": {
                        "color": 11027200,
                        "description": "**Performed by: **`SERVER`\n**On user: ** `BOCXOD Zich`\n**Reason : **`Unassigned AFK`",
                        "footer": {
                            "icon_url": undefined,
                            "text": "You can rejoin after getting kicked.",
                        },
                        "timestamp": "2023-04-02T09:12:00.000Z",
                        "title": "Kicked",

                    }
                },
            }
        }, {
            in: "[2023-04-14 16:56] !KICK           performed by 'PRISM user Tommy_Bot' on ' cassius23': test - Discord User cassius23",
            out: {
                "priv": {
                    "data": {
                        "color": 11027200,
                        "description": "**Performed by: **`Tommy_Bot`\n**On user: ** `cassius23`\n**Reason : **`test - Discord User cassius23`",
                        "footer": {
                            "icon_url": undefined,
                            "text": "PRISM",
                        },
                        "timestamp": "2023-04-14T14:56:00.000Z",
                        "title": "KICK",
                    }
                },
                "pub": {
                    "data": {
                        "color": 11027200,
                        "description": "**Performed by: **`Tommy_Bot`\n**On user: ** `cassius23`\n**Reason : **`test - Discord User cassius23`",
                        "footer": {
                            "icon_url": undefined,
                            "text": "You can rejoin after getting kicked.",
                        },
                        "timestamp": "2023-04-14T14:56:00.000Z",
                        "title": "Kicked",
                    }
                },
            }
        }, {
            in: "[2023-04-14 17:34] !REPORT         performed by '[POV] DusanYUgoslavia': yess",
            out: {
                "priv": {
                    "data": {
                        "color": 9019664,
                        "description": "**Performed by: **`[POV] DusanYUgoslavia`\n**Reason : **`yess`",
                        "footer": {
                            "icon_url": undefined,
                            "text": "IN-GAME",
                        },
                        "timestamp": "2023-04-14T15:34:00.000Z",
                        "title": "REPORT",
                    }
                },
            }
        }, {
            in: "[2023-04-14 17:43] !MESSAGE        performed by ' cassius23' on '[POV] DusanYUgoslavia': test -  cassius23",
            out: {
                "priv": {
                    "data": {
                        "color": 2123412,
                        "description": "**Performed by: **`cassius23`\n**On user: ** `[POV] DusanYUgoslavia`\n**Message : **`test`",
                        "footer": {
                            "icon_url": undefined,
                            "text": "IN-GAME",
                        },
                        "timestamp": "2023-04-14T15:43:00.000Z",
                        "title": "MESSAGE",
                    }
                },
            }
        }, {
            in: "[2023-04-14 18:15] !REPORT         performed by ' 'Kebabtime'': tk",
            out: {
                "priv": {
                    "data": {
                        "color": 9019664,
                        "description": "**Performed by: **`'Kebabtime'`\n**Reason : **`tk`",
                        "footer": {
                            "icon_url": undefined,
                            "text": "IN-GAME",
                        },
                        "timestamp": "2023-04-14T16:15:00.000Z",
                        "title": "REPORT",
                    }
                },
            }
        }, {
            in: "[2023-04-01 15:30] MAPVOTERESULT   performed by '[POV] ARC*fecht_niko': Vote finished: Aas: 32 | Ins: 11",
            out: {
                "priv": {
                    "color": 10181046,
                    "description": "**Performed by: **`[POV] ARC*fecht_niko`\n** Aas: **`32`\n** Ins: **`11`",
                    "footer": {
                        "icon_url": undefined,
                        "text": "IN-GAME",
                    },
                    "timestamp": "2023-04-01T13:30:00.000Z",
                    "title": "MAP VOTE RESULTS",
                },
                "pub": {
                    "color": 10181046,
                    "description": "**Performed by: **`[POV] ARC*fecht_niko`\n** Aas: **`32`\n** Ins: **`11`",
                    "footer": undefined,
                    "timestamp": "2023-04-01T13:30:00.000Z",
                    "title": "Map Vote Results",
                },
            },
        }
    ];

    tests.forEach(t => {
        const parsed = parseCommandLine(t.in);
        if (!parsed) {
            expect(parsed).toBeTruthy()
            return;
        }
        expect(prepareEmbeds(parsed)).toEqual(t.out);
    });
});
