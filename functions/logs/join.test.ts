import config from "../../config.js";
import { parseJoinLine } from "./join.js";

test("parseJoinLine", () => {
    const tests = [
        {
            in: "[2023-03-31 23:53:53]	3037f1e5fd6c4ed2bb3caad802a723dc	1	[GG] Ukranov	2020-05-05	2.222.127.13	(LEGACY)(VAC BANNED)",
            out: {
                "created": new Date("2020-05-05"),
                "joined": new Date("2023-03-31T23:53:53.000" + config.timezone),
                "hash": "3037f1e5fd6c4ed2bb3caad802a723dc",
                "ip": "2.222.127.13",
                "legacy": true,
                "level": "1",
                "name": "Ukranov",
                "tag": "[GG]",
                "typ": 0,
                "vacBan": true,
            }
        }
    ];

    tests.forEach(t => {
        expect(parseJoinLine(t.in)).toEqual(t.out);
    });
});
