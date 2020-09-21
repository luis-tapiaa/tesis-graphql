const { db, getFields, pgp } = require("../pgAdaptor");

const jwt = require("jsonwebtoken");

const types = `
    scalar Date

    type Auth {
        user_id: ID!
        token: String!
        token_exp: Int!
    }

	type Usuario {
		id: ID!
		codigo: String
		a_paterno: String!
		a_materno: String
		nombre: String!
		f_nacimiento: String
		genero: String
		biblioteca_id: ID!
		grupo_usuario_id: ID!
		f_registro: Date
		f_vencimiento: Date
		usuario: String
		password: String
		nota: String
		direccion: Direccion
		contacto: Contacto
		preferencias: Preferencias
	}

	input UsuarioInput {
		codigo: String
		a_paterno: String
		a_materno: String
		nombre: String
		f_nacimiento: String
		genero: String
		biblioteca_id: ID
		grupo_usuario_id: ID
		f_registro: String
		f_vencimiento: String
		usuario: String
		password: String
		nota: String
        direccion: String
		contacto: String
		preferencias: String
	}
`;

const queries = `
    usuarios: [Usuario]!
    usuario(id: ID!): Usuario
    login(usuario: String!, password: String!): Auth
    decode(token: String!): String
`;

const mutations = `
    crearUsuario(input: UsuarioInput!): Usuario
    eliminarUsuario(id: ID): Int
    editarUsuario(id: ID! input: UsuarioInput!): Usuario
`;

const values = {
	usuarios: (args, root, info) => (
		db.any('SELECT ${fields:name} FROM usuarios', getFields(info))
			.then(res => res) 
			.catch(err => err)
    ),
	usuario: ({ id }, root, info) => (
		db.one('SELECT ${fields:name} FROM usuarios WHERE id=${id}', { id, ...getFields(info)})
			.then(res => res) 
			.catch(err => err)
	),
    login: ({ usuario, password }) => (
        db.one('SELECT id FROM usuarios WHERE usuario=$1 AND password=$2', [usuario, password])
            .then(({ id }) => {                
                const token = jwt.sign({ id, usuario }, 'Fe$4r$g0n', { expiresIn: '30s' })
                return { 
                    token,
                    token_exp: 6,
                    user_id: id
                };
            }) 
			.catch(err => err)
    ),
    decode: ({ token }) => {
        const decToken = jwt.verify(token, 'Fe$4r$g0n');
        console.log(decToken);
        return decToken.id;
    },
	crearUsuario: ({ input }) => (
		db.one('INSERT INTO usuarios(${this:name}) VALUES(${this:csv}) RETURNING *', input)
			.then(res => res) 
			.catch(err => err)
	),
	editarUsuario: ({ input, id }) => (
        db.one(pgp.helpers.update(input, null, 'usuarios') + ' WHERE id=$1 RETURNING *', id)
            .then(res => res) 
			.catch(err => err)
    ),
	eliminarUsuario: ({ id }) => (
		db.result('DELETE FROM usuarios WHERE id=$1', id)
			.then(res => res.rowCount) 
			.catch(err => err)
	)
};

const usuario = {
    values,
    types,
    queries,
    mutations
}

exports.usuario = usuario;