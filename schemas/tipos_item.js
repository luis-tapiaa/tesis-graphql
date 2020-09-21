const { db, getFields, pgp } = require("../pgAdaptor");

const types = `
	type TipoItem {
		id: ID!
		codigo: String!
		nombre: String!
		costo_prestamo: Float
		disponible_prestamo: Boolean
		nota: String
	}


	input TipoItemInput {
        codigo: String
		nombre: String
		costo_prestamo: Float
		disponible_prestamo: Boolean
		nota: String
	}
`;

const queries = `
    tiposItem: [TipoItem]!
    tipoItem(id: ID!): TipoItem
`;

const mutations = `
    crearTipoItem(input: TipoItemInput!): TipoItem
    eliminarTipoItem(id: ID): Int
    editarTipoItem(id: ID! input: TipoItemInput!): TipoItem
`;

const values = {
	tiposItem: (args, root, info) => (
		db.any('SELECT ${fields:name} FROM tipos_item', getFields(info))
			.then(res => res) 
			.catch(err => err)
    ),
	tipoItem: ({ id }, root, info) => (
		db.one('SELECT ${fields:name} FROM tipos_item WHERE id=${id}', { id, ...getFields(info)})
			.then(res => res) 
			.catch(err => err)
	),
	crearTipoItem: ({ input }) => (
		db.one('INSERT INTO tipos_item(${this:name}) VALUES(${this:csv}) RETURNING *', input)
			.then(res => res) 
			.catch(err => err)
	),
	editarTipoItem: ({ input, id }) => (
        db.one(pgp.helpers.update(input, null, 'tipos_item') + ' WHERE id=$1 RETURNING *', id)
            .then(res => res) 
			.catch(err => err)
    ),
	eliminarTipoItem: ({ id }) => (
		db.result('DELETE FROM tipos_item WHERE id=$1', id)
			.then(res => res.rowCount) 
			.catch(err => err)
	)
};

const tipoItem = {
    values,
    types,
    queries,
    mutations
}

exports.tipoItem = tipoItem;