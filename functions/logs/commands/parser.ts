import config from "../../../config.js";
import { User, UserType } from "../interfaces.js";
import { decideIssuerType } from "../utils.js";

export interface CommandData {
    command: string;
    date: Date;

    issuer: User;
    receiver?: User;

    body?: string;
}

const regex = /\[(?<date>(\d{4})-(\d{2})-(\d{2}))\s(?<time>(\d{2}):(\d{2})(:\d{2})?)\]\s!?(?<command>\w*)[^']*'((PRISM user (?<prism>\S+))|(?<server>SERVER)|((?<issuer>(?<i_tag>\S+)? (?<i_name>\S+))))'( on '((?<receiver>(?<r_tag>\S+)? (?<r_name>\S+)))')?:[ ]?(?<body>.*)/;

export const parseCommandLine = (line: string): CommandData | null => {
    const match = line.match(regex);
    if (!match || !match.groups) {
        console.log("Unable to parse command line: ", line);
        return null;
    }

    const groups = match.groups;

    const out: CommandData = {
        command: groups.command,
        date: new Date(groups.date + "T" + groups.time + config.timezone),
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

