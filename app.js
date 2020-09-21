const graphql = require("graphql");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = graphql;

const { biblioteca } = require("./schemas/bibliotecas");
const { grupoUsuario } = require("./schemas/grupos_usuario");
const { usuario } = require("./schemas/usuarios");
const { tipoItem } = require("./schemas/tipos_item");
const { registroBib } = require("./schemas/registros_bib");
const { item } = require("./schemas/items");
const { prestamo } = require("./schemas/prestamos");
const { multa } = require("./schemas/multas");
const { cuenta } = require("./schemas/cuentas");
const { politica } = require("./schemas/politicas");

const root = {
	...biblioteca.values,
    ...grupoUsuario.values,
    ...usuario.values,
    ...tipoItem.values,
    ...registroBib.values,
    ...item.values,
    ...prestamo.values,
    ...multa.values,
    ...cuenta.values,
    ...politica.values
}

var app = express();
app.use(
  '/',
  graphqlHTTP({
    schema: buildSchema(`
		${biblioteca.types}
        ${grupoUsuario.types}
        ${usuario.types}
        ${tipoItem.types}
        ${registroBib.types}
        ${item.types}
        ${prestamo.types}
        ${multa.types}
        ${cuenta.types}
        ${politica.types}

		type RootQuery {			            
            ${biblioteca.queries}
            ${grupoUsuario.queries}
            ${usuario.queries}
            ${tipoItem.queries}
            ${registroBib.queries}
            ${item.queries}
            ${prestamo.queries}
            ${multa.queries}
            ${cuenta.queries}
            ${politica.queries}
		}

		type RootMutation {
			${biblioteca.mutations}
            ${grupoUsuario.mutations}
            ${usuario.mutations}
            ${tipoItem.mutations}
            ${registroBib.mutations}
            ${item.mutations}
            ${prestamo.mutations}
            ${multa.mutations}
            ${cuenta.mutations}
            ${politica.mutations}
		}

		schema {
			query: RootQuery
			mutation: RootMutation
		}
	`),
	rootValue: root,
    graphiql: true
  })
);

app.listen(3010, () =>
  console.log('Servidor corriendo en localhost:3010')
);
