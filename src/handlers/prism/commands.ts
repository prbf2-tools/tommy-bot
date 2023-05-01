import prism, { PRISM, Subject } from "./index.js";

class CommandsQueue {
    private point: Promise<void> | null = null;
    private prism: PRISM = prism

    async add(command: string): Promise<string> {
        const p = new Promise<string>(resolve => {

            const point = this.point;

            const handle = async () => {
                const chatListener = (fields: string[][]) => {
                    // TODO: find response logic
                    const response = ""

                    this.prism.removeListener(Subject.Chat, chatListener)

                    resolve(response)
                }

                this.prism.on(Subject.Chat, chatListener)

                this.prism.sendChat(command)
            }

            if (point !== null) {
                point.finally(() => {
                    handle()
                })
            } else {
                handle()
            }
        })

        this.point = new Promise<void>(resolve => {
            p.finally(() => {
                resolve()
            })
        })

        return p
    }
}

const queue = new CommandsQueue()

export function init(): Promise<string> {
    return queue.add("!init");
}

export function unbanid(hashID: string): Promise<string> {
    return queue.add(`!unbanid ${hashID}`);
}

export function banid(hashID: string, reason: string): Promise<string> {
    return queue.add(`!banid ${hashID} ${reason}`);
}

export function timebanid(hashID: string, duration: string, reason: string): Promise<string> {
    return queue.add(`!timebanid ${hashID} ${duration} ${reason}`);
}
