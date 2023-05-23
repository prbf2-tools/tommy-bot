import { defineConfig } from '@mikro-orm/core';

import { Role } from "./entities/role.js";
import { User } from "./entities/user.js";

export default defineConfig({
    entities: [User, Role],
    dbName: 'tommy.sqlite3',
    type: 'sqlite',
});
