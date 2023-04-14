import { parseAdminCommand, prepDescription } from "./utils.js";

test("prepDescription", () => {
    const player = {
        name: "Name",
    };

    const playerWithTag = {
        tag: "TAG",
        name: "Name",
    };

    const tests = [
        {
            blueprint: {},
            data: {
                body: "Test",
                issuer: player,
            },
            out: "**Performed by: **`Name`\n**Reason : **`Test`"
        }, {
            blueprint: {
                header: null,
            },
            data: {
                body: "Test",
                issuer: player,
            },
            out: "**Performed by: **`Name`\nTest"
        }, {
            blueprint: {},
            data: {
                body: null,
                issuer: player,
            },
            out: "**Performed by: **`Name`"
        }, { // receiver
            blueprint: {},
            data: {
                body: null,
                issuer: playerWithTag,
                receiver: player,
            },
            out: "**Performed by: **`TAG Name`\n**On user: ** `Name`"
        }
    ];

    tests.forEach(t => {
        expect(prepDescription(t.blueprint, t.data)).toEqual(t.out);
    });
});

test("parseAdminCommand", () => {
    const tests = [
        {
            in: "[2023-04-01 10:11] !INIT           performed by 'TAG name': ",
            out: {
                "body": "",
                "command": "INIT",
                "issuer": {
                    "name": "name",
                    "tag": "TAG",
                },
                "issuer_type": "user",
                "orig": "[2023-04-01 10:11] !INIT performed by 'TAG name':",
            }
        }, {
            in: "[2023-04-14 20:23] !REPORT         performed by ' Shil': dont switch!",
            out: {
                "body": " dont switch!",
                "command": "REPORT",
                "issuer": {
                    "name": "Shil",
                    "tag": "",
                },
                "issuer_type": "user",
                "orig": "[2023-04-14 20:23] !REPORT performed by ' Shil': dont switch!",
            }
        }
    ];

    tests.forEach(t => {
        expect(parseAdminCommand(t.in)).toEqual(t.out);
    });
});
