import { UserType } from "../interfaces.js";
import { decideIssuerType } from "../utils.js";
const regex = /\[(?<date>(\d{4})-(\d{2})-(\d{2}))\s(?<time>(\d{2}):(\d{2})(:\d{2})?)\]\s!?(?<command>\w*)[^']*'((PRISM user (?<prism>\S+))|(?<server>SERVER)|((?<issuer>(?<i_tag>\S+)? (?<i_name>\S+))))'( on '((?<receiver>(?<r_tag>\S+)? (?<r_name>\S+)))')?:[ ]?(?<body>.*)/;
export const parseCommandLine = (line) => {
    const match = line.match(regex);
    if (!match || !match.groups) {
        console.log("Unable to parse command line: ", line);
        return null;
    }
    const groups = match.groups;
    const out = {
        command: groups.command,
        date: new Date(groups.date + "T" + groups.time),
        issuer: {
            typ: decideIssuerType(groups),
            name: groups.prism || groups.server || groups.i_name,
            tag: groups.i_tag,
        },
        body: groups.body,
    };
    if (groups.receiver) {
        out.receiver = {
            typ: UserType.Player,
            name: groups.r_name,
            tag: groups.r_tag,
        };
    }
    return out;
};
