const { db, getFields, pgp } = require("../pgAdaptor");

const types = `
	type Prestamo {
		id: ID!
        usuario_id: ID!
        item_id: ID!
        f_prestamo: Date
        f_vencimiento: Date
        f_devolucion: Date
        renovaciones: Int
	}


	input PrestamoInput {
        usuario_id: ID
        item_id: ID
        f_prestamo: String
        f_vencimiento: String
        f_devolucion: String
        renovaciones: Int
	}
`;

const queries = `
    prestamos: [Prestamo]!
    prestamo(id: ID!): Prestamo
`;

const mutations = `
    crearPrestamo(input: PrestamoInput!): Prestamo
    eliminarPrestamo(id: ID): Int
    editarPrestamo(id: ID! input: PrestamoInput!): Prestamo
`;

const values = {
	prestamos: (args, root, info) => (
		db.any('SELECT ${fields:name} FROM prestamos', getFields(info))
			.then(res => res) 
			.catch(err => err)
    ),
	prestamo: ({ id }, root, info) => (
		db.one('SELECT ${fields:name} FROM prestamos WHERE id=${id}', { id, ...getFields(info)})
			.then(res => res) 
			.catch(err => err)
	),
	crearPrestamo: ({ input }) => (
		db.one('INSERT INTO prestamos(${this:name}) VALUES(${this:csv}) RETURNING *', input)
			.then(res => res) 
			.catch(err => err)
	),
	editarPrestamo: ({ input, id }) => (
        db.one(pgp.helpers.update(input, null, 'prestamos') + ' WHERE id=$1 RETURNING *', id)
            .then(res => res) 
			.catch(err => err)
    ),
	eliminarPrestamo: ({ id }) => (
		db.result('DELETE FROM prestamos WHERE id=$1', id)
			.then(res => res.rowCount) 
			.catch(err => err)
	)
};

const prestamo = {
    values,
    types,
    queries,
    mutations
}

exports.prestamo = prestamo;