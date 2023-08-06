import { defineConfig } from '@mikro-orm/core';

import { Role } from "./db/entities/role.js";
import { User } from "./db/entities/user.js";

export default defineConfig({
    entities: [User, Role],
    dbName: 'tommy.sqlite3',
    type: 'sqlite',
});
