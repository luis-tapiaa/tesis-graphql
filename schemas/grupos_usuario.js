const { db, getFields, pgp } = require("../pgAdaptor");

const types = `
    scalar Preferencias

	type GrupoUsuario {
        id: ID!
        codigo: String!
        nombre: String!
        edad_min: Int
        edad_max: Int
        costo_asociacion: Float
        periodo_asociacion: Int
        categoria: String
        costo_reserva: Int
        biblioteca_id: ID
        retraso: Boolean
        itme_perdido: Boolean
        privacidad: String
        bloquear_expirados: String    
        preferencias: Preferencias
	}

	input GrupoUsuarioInput {
		codigo: String
        nombre: String
        edad_min: Int
        edad_max: Int
        costo_asociacion: Float
        periodo_asociacion: Int
        categoria: String
        costo_reserva: Int
        biblioteca_id: ID
        retraso: Boolean
        itme_perdido: Boolean
        privacidad: String
        bloquear_expirados: String    
        preferencias: String
	}
`;

const queries = `
    gruposUsuario: [GrupoUsuario]!
    grupoUsuario(id: ID!): GrupoUsuario
`;

const mutations = `
    crearGrupoUsuario(input: GrupoUsuarioInput!): GrupoUsuario
    eliminarGrupoUsuario(id: ID): Int
    editarGrupoUsuario(id: ID! input: GrupoUsuarioInput!): GrupoUsuario
`;

const values = {
	gruposUsuario: (args, root, info) => (
		db.any('SELECT ${fields:name} FROM grupos_usuario', getFields(info))
			.then(res => res) 
			.catch(err => err)
    ),
	grupoUsuario: ({ id }, root, info) => (
		db.one('SELECT ${fields:name} FROM grupos_usuario WHERE id=${id}', { id, ...getFields(info)})
			.then(res => res) 
			.catch(err => err)
	),
	crearGrupoUsuario: ({ input }) => (
		db.one('INSERT INTO grupos_usuario(${this:name}) VALUES(${this:csv}) RETURNING *', input)
			.then(res => res) 
			.catch(err => err)
	),
	editarGrupoUsuario: ({ input, id }) => (
        db.one(pgp.helpers.update(input, null, 'grupos_usuario') + ' WHERE id=$1 RETURNING *', id)
            .then(res => res) 
			.catch(err => err)
    ),
	eliminarGrupoUsuario: ({ id }) => (
		db.result('DELETE FROM grupos_usuario WHERE id=$1', id)
			.then(res => res.rowCount) 
			.catch(err => err)
	)
};

const grupoUsuario = {
    values,
    types,
    queries,
    mutations
}

exports.grupoUsuario = grupoUsuario;
