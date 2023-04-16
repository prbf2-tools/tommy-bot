import { parseCommandLine } from "./parsers/command.js";
import { prepDescription } from "./utils.js";


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

