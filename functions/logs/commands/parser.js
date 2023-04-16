export var UserType;
(function (UserType) {
    UserType[UserType["Player"] = 0] = "Player";
    UserType[UserType["Prism"] = 1] = "Prism";
    UserType[UserType["Server"] = 2] = "Server";
})(UserType = UserType || (UserType = {}));
export class User {
    typ;
    name;
    tag;
    toString() {
        if (this.tag) {
            return this.tag + " " + this.name;
        }
        return this.name;
    }
}
const regex = /\[(?<date>(\d{4})-(\d{2})-(\d{2}))\s(?<time>(\d{2}):(\d{2})(:\d{2})?)\]\s!?(?<command>\w*)[^\']*'((PRISM user (?<prism>\S+))|(?<server>SERVER)|((?<issuer>(?<i_tag>\S+)? (?<i_name>\S+))))'( on '((?<receiver>(?<r_tag>\S+)? (?<r_name>\S+)))')?:\s(?<body>.*)/;
export const parseCommandLine = (line) => {
    const match = line.match(regex);
    if (!match || !match.groups) {
        console.log("Unable to parse command line: ", line);
        return null;
    }
    const groups = match.groups;
    let out = {
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
const decideIssuerType = (groups) => {
    if (groups.prism) {
        return UserType.Prism;
    }
    else if (groups.server) {
        return UserType.Server;
    }
    return UserType.Player;
};
