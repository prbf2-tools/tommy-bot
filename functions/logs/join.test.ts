import dayjs from "dayjs";
import config from "../../config.js";
import { parseJoinLine, prepareEmbeds } from "./join.js";

test("prepareEmbeds", () => {
    const tests = [
        {
            in: "[2023-03-31 23:53:53]	c037f1e5fd6c4ed2bb3caad702a723dc	1	[TAG] User	2020-05-05	192.168.127.13	(LEGACY)(VAC BANNED)",
            out: {
                "priv": {
                    "data": {
                        "color": 6619315,
                        "description": "**Hash-ID: **`c037f1e5fd6c4ed2bb3caad702a723dc`\n**IP: **`192.168.***.***` :flag_white:\n**Account Level: **`1`\n**Account Type: **`Legacy and VAC Banned`\n**Creation Date: **<t:1588629600:d>\n**Joined: **<t:1680299633:d> <t:1680299633:T>",
                        "title": "User",
                    }
                }
            }
        }
    ];

    tests.forEach(t => {
        const parsed = parseJoinLine(t.in);
        if (!parsed) {
            return;
        }

        expect(prepareEmbeds(parsed)).toEqual(t.out);
    });
});

test("parseJoinLine", () => {
    const tests = [
        {
            in: "[2023-03-31 23:53:53]	c037f1e5fd6c4ed2bb3caad702a723dc	1	[TAG] User	2020-05-05	192.168.127.13	(LEGACY)(VAC BANNED)",
            out: {
                "created": dayjs("2020-05-05"),
                "joined": dayjs("2023-03-31T23:53:53.000" + config.timezone),
                "hash": "c037f1e5fd6c4ed2bb3caad702a723dc",
                "ip": "192.168.127.13",
                "legacy": true,
                "level": "1",
                "name": "User",
                "tag": "[TAG]",
                "typ": 0,
                "vacBan": true,
            }
        }
    ];

    tests.forEach(t => {
        expect(parseJoinLine(t.in)).toEqual(t.out);
    });
});
