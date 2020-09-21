const { db, getFields, pgp } = require("../pgAdaptor");

const types = `
	type Cuenta {
		id: ID!
        cargo: Float!
        pendiente: Float
        multa_id: ID!
        item_id: ID
        usuario_id: ID!
        nota: String
	}


	input CuentaInput {
		cargo: Float
        pendiente: Float
        multa_id: ID
        item_id: ID
        usuario_id: ID
        nota: String
	}
`;

const queries = `
    cuentas: [Cuenta]!
    cuenta(id: ID!): Cuenta
`;

const mutations = `
    crearCuenta(input: CuentaInput!): Cuenta
    eliminarCuenta(id: ID): Int
    editarCuenta(id: ID! input: CuentaInput!): Cuenta
`;

const values = {
	cuentas: (args, root, info) => (
		db.any('SELECT ${fields:name} FROM cuentas', getFields(info))
			.then(res => res) 
			.catch(err => err)
    ),
	cuenta: ({ id }, root, info) => (
		db.one('SELECT ${fields:name} FROM cuentas WHERE id=${id}', { id, ...getFields(info)})
			.then(res => res) 
			.catch(err => err)
	),
	crearCuenta: ({ input }) => (
		db.one('INSERT INTO cuentas(${this:name}) VALUES(${this:csv}) RETURNING *', input)
			.then(res => res) 
			.catch(err => err)
	),
	editarCuenta: ({ input, id }) => (
        db.one(pgp.helpers.update(input, null, 'cuentas') + ' WHERE id=$1 RETURNING *', id)
            .then(res => res) 
			.catch(err => err)
    ),
	eliminarCuenta: ({ id }) => (
		db.result('DELETE FROM cuentas WHERE id=$1', id)
			.then(res => res.rowCount) 
			.catch(err => err)
	)
};

const cuenta = {
    values,
    types,
    queries,
    mutations
}

exports.cuenta = cuenta;