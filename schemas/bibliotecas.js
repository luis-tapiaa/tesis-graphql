const { db, getFields, pgp } = require("../pgAdaptor");

const types = `
	scalar Direccion

	scalar Contacto

	type Biblioteca {
		id: ID!
		codigo: String!
		nombre: String!
		direccion: Direccion
		contacto: Contacto
		url: String
		nota: String
	}

	input BibliotecaInput {
		codigo: String
		nombre: String
		direccion: String
		contacto: String
		url: String
		nota: String
	}
`;

const queries = `
    bibliotecas: [Biblioteca]!
	biblioteca(id: ID!): Biblioteca
`;

const mutations = `
    crearBiblioteca(input: BibliotecaInput!): Biblioteca
	eliminarBiblioteca(id: ID): Int
    editarBiblioteca(id: ID! input: BibliotecaInput!): Biblioteca
`;

const values = {
	bibliotecas: (args, root, info) => (
		db.any('SELECT ${fields:name} FROM bibliotecas', getFields(info))
			.then(res => res) 
			.catch(err => err)
    ),
	biblioteca: ({ id }, root, info) => (
		db.one('SELECT ${fields:name} FROM bibliotecas WHERE id=${id}', { id, ...getFields(info)})
			.then(res => res) 
			.catch(err => err)
	),
	crearBiblioteca: ({ input }) => (
		db.one('INSERT INTO bibliotecas(${this:name}) VALUES(${this:csv}) RETURNING *', input)
			.then(res => res) 
			.catch(err => err)
	),
	editarBiblioteca: ({ input, id }) => (
        db.one(pgp.helpers.update(input, null, 'bibliotecas') + ' WHERE id=$1 RETURNING *', id)
            .then(res => res) 
			.catch(err => err)
    ),
	eliminarBiblioteca: ({ id }) => (
		db.result('DELETE FROM bibliotecas WHERE id=$1', id)
			.then(res => res.rowCount) 
			.catch(err => err)
	)
};

const biblioteca = {
    values,
    types,
    queries,
    mutations
}

exports.biblioteca = biblioteca;
