const { db, getFields, pgp } = require("../pgAdaptor");

const types = `
    scalar Marc

	type RegistroBib {
		id: ID!
        marc: Marc
	}


	input RegistroBibInput {
        marc: String
	}
`;

const queries = `
    registrosBib: [RegistroBib]!
    registroBib(id: ID!): RegistroBib
`;

const mutations = `
    crearRegistroBib(input: RegistroBibInput!): RegistroBib
    eliminarRegistroBib(id: ID): Int
    editarRegistroBib(id: ID! input: RegistroBibInput!): RegistroBib
`;

const values = {
	registrosBib: (args, root, info) => (
		db.any('SELECT ${fields:name} FROM registros_bib', getFields(info))
			.then(res => res) 
			.catch(err => err)
    ),
	registroBib: ({ id }, root, info) => (
		db.one('SELECT ${fields:name} FROM registros_bib WHERE id=${id}', { id, ...getFields(info)})
			.then(res => res) 
			.catch(err => err)
	),
	crearRegistroBib: ({ input }) => (
		db.one('INSERT INTO registros_bib(${this:name}) VALUES(${this:csv}) RETURNING *', input)
			.then(res => res) 
			.catch(err => err)
	),
	editarRegistroBib: ({ input, id }) => (
        db.one(pgp.helpers.update(input, null, 'registros_bib') + ' WHERE id=$1 RETURNING *', id)
            .then(res => res) 
			.catch(err => err)
    ),
	eliminarRegistroBib: ({ id }) => (
		db.result('DELETE FROM registros_bib WHERE id=$1', id)
			.then(res => res.rowCount) 
			.catch(err => err)
	)
};

const registroBib = {
    values,
    types,
    queries,
    mutations
}

exports.registroBib = registroBib;