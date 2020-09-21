const { db, getFields, pgp } = require("../pgAdaptor");

const types = `
	type Multa {
		id: ID!
		nombre: String!
        biblioteca_id: ID
        cargo: Float
	}


	input MultaInput {
        nombre: String
        biblioteca_id: ID
        cargo: Float
	}
`;

const queries = `
    multas: [Multa]!
    multa(id: ID!): Multa
`;

const mutations = `
    crearMulta(input: MultaInput!): Multa
    eliminarMulta(id: ID): Int
    editarMulta(id: ID! input: MultaInput!): Multa
`;

const values = {
	multas: (args, root, info) => (
		db.any('SELECT ${fields:name} FROM multas', getFields(info))
			.then(res => res) 
			.catch(err => err)
    ),
	multa: ({ id }, root, info) => (
		db.one('SELECT ${fields:name} FROM multas WHERE id=${id}', { id, ...getFields(info)})
			.then(res => res) 
			.catch(err => err)
	),
	crearMulta: ({ input }) => (
		db.one('INSERT INTO multas(${this:name}) VALUES(${this:csv}) RETURNING *', input)
			.then(res => res) 
			.catch(err => err)
	),
	editarMulta: ({ input, id }) => (
        db.one(pgp.helpers.update(input, null, 'multas') + ' WHERE id=$1 RETURNING *', id)
            .then(res => res) 
			.catch(err => err)
    ),
	eliminarMulta: ({ id }) => (
		db.result('DELETE FROM multas WHERE id=$1', id)
			.then(res => res.rowCount) 
			.catch(err => err)
	)
};

const multa = {
    values,
    types,
    queries,
    mutations
}

exports.multa = multa;