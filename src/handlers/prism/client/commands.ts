import { PRISM } from "./index.js";
import { Subject, User } from "./responses.js";

export enum RCONCommand {
    GetUsers = "getusers",
    AddUser = "adduser",
    ChangeUser = "changeuser",
    DeleteUser = "deleteuser",
    ListPlayers = "listplayers",
    ServerDetails = "serverdetails",
    GameplayDetails = "gameplaydetails",
    ReadMaplist = "readmaplist",
    // ReadBanlist = "readbanlist", // inactive
    APIAdmin = "apiadmin",
    ServerDetailsAlways = "serverdetailsalways",
}


export class Commands {
    private point: Promise<void> | null = null;
    private prism: PRISM;

    constructor(prism: PRISM) {
        this.prism = prism
    }

    private async add<T>(command: RCONCommand, success: Subject, ...args: string[]): Promise<T> {
        const p = new Promise<T>((resolve, reject) => {

            const point = this.point;

            const handle = async () => {
                const successListener = (output: T) => {
                    this.prism.removeListener(success, successListener);
                    this.prism.removeListener(Subject.Error, successListener);

                    resolve(output);
                };

                const errorListener = (output: Error) => {
                    this.prism.removeListener(Subject.Error, successListener);
                    this.prism.removeListener(success, successListener);

                    reject(output);
                };

                this.prism.on(success, successListener);
                this.prism.on(Subject.Error, errorListener);

                this.prism.send(command, ...args)
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

    getUsers(): Promise<User[]> {
        return this.add(RCONCommand.GetUsers, Subject.GetUsers)
    }

    addUser(name: string, password: string, level: number): Promise<User[]> {
        return this.add(RCONCommand.AddUser, Subject.GetUsers, name, password, level.toString())
    }

    changeUser(name: string, newName: string, newPassword: string, level: number): Promise<User[]> {
        return this.add(RCONCommand.ChangeUser, Subject.GetUsers, name, newName, newPassword, level.toString())
    }

    deleteUser(name: string): Promise<User[]> {
        return this.add(RCONCommand.DeleteUser, Subject.GetUsers, name)
    }
}
