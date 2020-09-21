require('dotenv').config();
const pgPromise = require('pg-promise');

const pgp = pgPromise({});

const config = {
    connectionString: "postgres://uotmzyhc:WIMFEosuYGbsf7gc6nL9GxaLPKSkmLj-@lallah.db.elephantsql.com:5432/uotmzyhc"
};

const db = pgp(config);

const getFields = (info) => ({ fields: info.fieldNodes[0].selectionSet.selections.map(s => s.name.value) });

exports.db = db;
exports.pgp = pgp;
exports.getFields = getFields;