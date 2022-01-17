const express = require('express')
const { graphqlHTTP } = require("express-graphql")
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLList
} = require('graphql')
const app = express()

const autonomias = require('./data/autonomias.json')
const provincias = require('./data/provincias.json')
const municipios = require('./data/municipios.json')

const AutonomiaType = new GraphQLObjectType({
    name: 'Autonomia',
    description: 'Representa una autonomia',
    fields: () => ({
        autonomia_id: { type: GraphQLNonNull(GraphQLString) },
        nombre: { type: GraphQLNonNull(GraphQLString)},
        provincias: {
            type: GraphQLList(ProvinciaType),
            args: {
                nombreContains: { type: GraphQLString }
            },
            resolve: (autonomia, args) => {
                const provinciasInAutonomia = provincias.filter( provincia => provincia.autonomia_id === autonomia.autonomia_id)
                return filterByNombreContains(provinciasInAutonomia, args.nombreContains)
            }
        }
    })
})

const ProvinciaType = new GraphQLObjectType({
    name: 'Provincia',
    description: 'Representa una provincia',
    fields: () => ({
        autonomia_id: { type: GraphQLNonNull(GraphQLString) },
        autonomia: {
            type: AutonomiaType,
            resolve: (provincia) => {
                return autonomias.find( autonomia => autonomia.autonomia_id === provincia.autonomia_id )
            }
        },
        municipios: {
            type: GraphQLList(MunicipioType),
            args: {
                nombreContains: { type: GraphQLString }
            },
            resolve: (provincia, args) => {
                const municipiosInProvincia = municipios.filter( municipio => municipio.provincia_id === provincia.provincia_id)
                return filterByNombreContains(municipiosInProvincia, args.nombreContains)
            }
        },
        provincia_id: { type: GraphQLNonNull(GraphQLString) },
        nombre: { type: GraphQLNonNull(GraphQLString)}
    })
})

const MunicipioType = new GraphQLObjectType({
    name: 'Municipio',
    description: 'Representa un municipio',
    fields: () => ({
        municipio_id: { type: GraphQLNonNull(GraphQLString) },
        provincia_id: { type: GraphQLNonNull(GraphQLString) },
        provincia: {
            type: ProvinciaType,
            resolve: (municipio) => {
                return provincias.find( provincia => provincia.provincia_id === municipio.provincia_id )
            }
        },
        cmun: { type: GraphQLNonNull(GraphQLString) },
        dc: { type: GraphQLNonNull(GraphQLString) },
        nombre: { type: GraphQLNonNull(GraphQLString)}
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        autonomia: {
            type: AutonomiaType,
            description: 'Una autonomía',
            args: {
                id: { type: GraphQLString }
            },
            resolve: (parent, args) => autonomias.find( autonomia => autonomia.autonomia_id === args.id)
        },
        autonomias: {
            type: new GraphQLList(AutonomiaType),
            description: 'Lista de autonomías',
            args: {
                nombreContains: { type: GraphQLString }
            },
            resolve: (parent, args) => {
                return filterByNombreContains(autonomias, args.nombreContains)
            }
        },
        provincia: {
            type: ProvinciaType,
            description: 'Una provincia',
            args: {
                id: { type: GraphQLString }
            },
            resolve: (parent, args) => provincias.find( provincia => provincia.provincia_id === args.id)
        },
        provincias: {
            type: new GraphQLList(ProvinciaType),
            description: 'Lista de provincias',
            args: {
                nombreContains: { type: GraphQLString }
            },
            resolve: (parent, args) => filterByNombreContains(provincias, args.nombreContains)
        },
        municipios: {
            type: new GraphQLList(MunicipioType),
            description: 'Lista de municipios',
            args: {
                nombreContains: { type: GraphQLString }
            },
            resolve: (parent, args) => filterByNombreContains(municipios, args.nombreContains)
        },
        municipio: {
            type: MunicipioType,
            description: 'Un municipio',
            args: {
                id: { type: GraphQLString }
            },
            resolve: (parent, args) => municipios.find( municipio => municipio.municipio_id === args.id)
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(5000., () => console.log('Servidor escuchando en puerto 5000'))

// Funciones de ayuda

// Obtiene todos los elementos en data que en su propiedad 'nombre' contienen la cadena 'filterInput'
function filterByNombreContains (data, filterInput) {
    if (filterInput) {
        var results = data.filter(
            (element) =>
                element.nombre
                .toLowerCase()
                .indexOf(filterInput.toLowerCase()) > -1
            )
            results = sortInputFirst(filterInput, results)
            return results
    }
    else return data
}

// Ordena los elementos data, primero los que su propiedad nombre empieza por 'input' y después los que no.
function sortInputFirst (input, data) {
    if (input) {
        const lowercaseInput = input.toLowerCase()
        var first = []
        var others = []
        for (var i = 0; i < data.length; i++) {
            if (data[i].nombre.toLowerCase().indexOf(lowercaseInput) === 0) {
                first.push(data[i])
            } else {
                others.push(data[i])
            }
        }
        first.sort()
        others.sort()
        return first.concat(others)
    }
    else return data
}