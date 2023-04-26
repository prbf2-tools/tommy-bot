import lodash from "lodash";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/lib/node";

import { User } from './users'

interface Data {
    users: User[],
}

class LowWithLodash<T> extends Low<T> {
    chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}

const defaultData: Data = {
    users: [],
}

const adapter = new JSONFile<Data>('db.json');
const db = new LowWithLodash(adapter, defaultData);
await db.read();

export default db;
