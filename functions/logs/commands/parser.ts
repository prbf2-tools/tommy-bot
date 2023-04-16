enum UserType {
  Player,
  Prism,
  Server,
}

interface User {
  typ: UserType;
  name: string;
  tag?: string;
}

interface Command {
  command: string;
  date: Date;

  issuer: User;
  receiver?: User;

  body?: string;
}

const regex = /\[(?<date>(\d{4})-(\d{2})-(\d{2}))\s(?<time>(\d{2}):(\d{2})(:\d{2})?)\]\s!?(?<command>\w*)[^\']*'((PRISM user (?<prism>\S+))|(?<server>SERVER)|((?<issuer>(?<i_tag>\S+)? (?<i_name>\S+))))'( on '((?<receiver>(?<r_tag>\S+)? (?<r_name>\S+)))')?:\s(?<body>.*)/

export const parseCommandLine = (line: string): Command | null => {
  const match = line.match(regex);
  if (!match) {
    return null;
  }

  const groups = match?.groups;

  if (!groups) {
    console.log("Unable to parse command line: ", line)
    return null
  }


  let out: Command = {
    command: groups.command,
    date: new Date(groups.date + "T" + groups.time),
    issuer: {
      typ: decideIssuerType(groups),
      name: groups.prism || groups.server || groups.i_name,
      tag: groups.i_tag,
    },
    body: groups.body,
  }

  if (groups.receiver) {
    out.receiver = {
      typ: UserType.Player,
      name: groups.r_name,
      tag: groups.r_tag,
    }
  }

  return out
}

const decideIssuerType = (groups: { [key: string]: string }): UserType => {
  if (groups.prism) {
    return UserType.Prism;
  } else if (groups.server) {
    return UserType.Server;
  }

  return UserType.Player;
}
