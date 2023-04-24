import prism from "./prism";

export function init() {
    prism.sendChat("!init");
}

export function unbanid(hashID: string) {
    prism.sendChat(`!unbanid ${hashID}`);
}

export function banid(hashID: string, reason: string) {
    prism.sendChat(`!banid ${hashID} ${reason}`);
}

export function timebanid(hashID: string, duration: string, reason: string) {
    prism.sendChat(`!timebanid ${hashID} ${duration} ${reason}`);
}
