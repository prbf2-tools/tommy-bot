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
export class UserDetailed extends User {
    ip;
    hash;
}
