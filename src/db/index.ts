import lodash from "lodash";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

import { User } from './users.js'

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

export default db;
