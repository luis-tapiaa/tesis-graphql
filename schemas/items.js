const { db, getFields, pgp } = require("../pgAdaptor");

const types = `
	type Item {
        id: ID!
        registro_bib_id: ID!
        codigo: String!
        tipo_item_id: ID!
        f_adquisicion: Date
        estado_item: String
        nota: String
        ubicacion: String
        precio: Float
        biblioteca_id: ID
        biblioteca_premanente_id: ID!
	}

	input ItemInput {
        registro_bib_id: ID
        codigo: String
        tipo_item_id: ID
        f_adquisicion: String
        estado_item: String
        nota: String
        ubicacion: String
        precio: Float
        biblioteca_id: ID
        biblioteca_premanente_id: ID
	}
`;

const queries = `
    items: [Item]!
	item(id: ID!): Item
`;

const mutations = `
    crearItem(input: ItemInput!): Item
	eliminarItem(id: ID): Int
    editarItem(id: ID! input: ItemInput!): Item
`;

const values = {
	items: (args, root, info) => (
		db.any('SELECT ${fields:name} FROM items', getFields(info))
			.then(res => res) 
			.catch(err => err)
    ),
	item: ({ id }, root, info) => (
		db.one('SELECT ${fields:name} FROM items WHERE id=${id}', { id, ...getFields(info)})
			.then(res => res) 
			.catch(err => err)
	),
	crearItem: ({ input }) => (
		db.one('INSERT INTO items(${this:name}) VALUES(${this:csv}) RETURNING *', input)
			.then(res => res) 
			.catch(err => err)
	),
	editarItem: ({ input, id }) => (
        db.one(pgp.helpers.update(input, null, 'items') + ' WHERE id=$1 RETURNING *', id)
            .then(res => res) 
			.catch(err => err)
    ),
	eliminarItem: ({ id }) => (
		db.result('DELETE FROM items WHERE id=$1', id)
			.then(res => res.rowCount) 
			.catch(err => err)
	)
};

const item = {
    values,
    types,
    queries,
    mutations
}

exports.item = item;
