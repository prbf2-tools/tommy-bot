export const ISSUERS = {
    USER: "user",
    PRISM: "PRISM",
    SERVER: "SERVER",
};

export const parseAdminCommand = (data) => {
    data = data.replace(/\s+/g, " ").trim();
    const split = data.split(" ");

    const output = {
        orig: data,
    };

    // '!REPORT',
    output.command = split[2].replace("!", "");

    let offset;

    if (split[5].includes(ISSUERS.PRISM)) {
        output.issuer_type = ISSUERS.PRISM;

        // "Tommy_Bot':"
        output.issuer = {
            tag: "",
            name: split[7].split("'")[0],
        };

        offset = 2;
    } else if (split[5].includes(ISSUERS.SERVER)) {
        output.issuer_type = ISSUERS.SERVER;
        output.issuer = {
            tag: "",
            name: ISSUERS.SERVER
        };
        offset = 0;
    } else {
        output.issuer_type = ISSUERS.USER;

        output.issuer = {
            tag: split[5].replace("'", ""),
            name: split[6].split("'")[0],
        };

        offset = 1;
    }

    output.body = data.split("]")[1].split(":")[1];

    if (split[6 + offset] !== undefined && split[6 + offset].includes("on")) {
        output.receiver = {
            tag: split[7 + offset].replace("'", ""),
            user: split[8 + offset].split("'")[0],
        };
    }

    return output;
};
