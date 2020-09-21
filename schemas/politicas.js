const { db, getFields, pgp } = require("../pgAdaptor");

const types = `
    scalar Valor

	type Politica {
		id: ID!
		biblioteca_id: ID!
		valor: Valor
	}


	input PoliticaInput {
		biblioteca_id: ID
		valor: String
	}
`;

const queries = `
    politicas: [Politica]!
    politica(id: ID!): Politica
`;

const mutations = `
    crearPolitica(input: PoliticaInput!): Politica
    eliminarPolitica(id: ID): Int
    editarPolitica(id: ID! input: PoliticaInput!): Politica
`;

const values = {
	politicas: (args, root, info) => (
		db.any('SELECT ${fields:name} FROM politicas', getFields(info))
			.then(res => res) 
			.catch(err => err)
    ),
	politica: ({ id }, root, info) => (
		db.one('SELECT ${fields:name} FROM politicas WHERE id=${id}', { id, ...getFields(info)})
			.then(res => res) 
			.catch(err => err)
	),
	crearPolitica: ({ input }) => (
		db.one('INSERT INTO politicas(${this:name}) VALUES(${this:csv}) RETURNING *', input)
			.then(res => res) 
			.catch(err => err)
	),
	editarPolitica: ({ input, id }) => (
        db.one(pgp.helpers.update(input, null, 'politicas') + ' WHERE id=$1 RETURNING *', id)
            .then(res => res) 
			.catch(err => err)
    ),
	eliminarPolitica: ({ id }) => (
		db.result('DELETE FROM politicas WHERE id=$1', id)
			.then(res => res.rowCount) 
			.catch(err => err)
	)
};

const politica = {
    values,
    types,
    queries,
    mutations
}

exports.politica = politica;