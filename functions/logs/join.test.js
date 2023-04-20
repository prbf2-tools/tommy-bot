import config from "../../config.js";
import { parseJoinLine } from "./join.js";
test("parseJoinLine", () => {
    const tests = [
        {
            in: "[2023-03-31 23:53:53]	c037f1e5fd6c4ed2bb3caad702a723dc	1	[TAG] User	2020-05-05	192.168.127.13	(LEGACY)(VAC BANNED)",
            out: {
                "created": new Date("2020-05-05"),
                "joined": new Date("2023-03-31T23:53:53.000" + config.timezone),
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
