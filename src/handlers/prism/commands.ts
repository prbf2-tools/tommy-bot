import { PRISM, Subject } from "./index.js";

export class Commands {
    private point: Promise<void> | null = null;
    private prism: PRISM;

    constructor(prism: PRISM) {
        this.prism = prism
    }

    private async add(command: string): Promise<string> {
        const p = new Promise<string>(resolve => {

            const point = this.point;

            const handle = async () => {
                const chatListener = (fields: string[]) => {
                    // TODO: find response logic
                    this.prism.removeListener(Subject.Success, chatListener);

                    resolve(fields[1]);
                };

                this.prism.on(Subject.Success, chatListener);

                this.prism.sendChat(command);
            };

            if (point !== null) {
                point.finally(() => {
                    handle();
                });
            } else {
                handle();
            }
        });

        this.point = new Promise<void>(resolve => {
            p.finally(() => {
                resolve();
            });
        });

        return p;
    }

    init(issuer: string): Promise<string> {
        return this.add("!init" + suffix(issuer));
    }

    unbanid(hashID: string): Promise<string> {
        return this.add(`!unbanid ${hashID}`);
    }

    banid(hashID: string, reason: string): Promise<string> {
        return this.add(`!banid ${hashID} ${reason}`);
    }

    timebanid(hashID: string, duration: string, reason: string): Promise<string> {
        return this.add(`!timebanid ${hashID} ${duration} ${reason}`);
    }
}

const suffix = (issuer: string): string => {
    return ` - Discord User ${issuer}`
}
