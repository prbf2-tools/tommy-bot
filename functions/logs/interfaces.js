export var UserType;
(function (UserType) {
    UserType[UserType["Player"] = 0] = "Player";
    UserType[UserType["Prism"] = 1] = "Prism";
    UserType[UserType["Server"] = 2] = "Server";
})(UserType || (UserType = {}));
export const dateFormat = "YYYY-MM-DD";
export const dateTimeFormat = dateFormat + " " + "HH:mm:ss";
export var DiscordTimeFormat;
(function (DiscordTimeFormat) {
    DiscordTimeFormat["Date"] = "d";
    DiscordTimeFormat["LongDate"] = "D";
    DiscordTimeFormat["Time"] = "t";
    DiscordTimeFormat["LongTime"] = "T";
    DiscordTimeFormat["DateTime"] = "f";
    DiscordTimeFormat["LongDateTime"] = "F";
    DiscordTimeFormat["Relative"] = "R";
})(DiscordTimeFormat || (DiscordTimeFormat = {}));
