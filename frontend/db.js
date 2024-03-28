const { MongoCliente } = require('mongodb')

let dbConnection
let uri = 'mongodb+srv://ExploreBragaAdmin:Discord123@explorebraga.dy233rx.mongodb.net/?retryWrites=true&w=majority'

module.exports = {
    connectToDb: (cb) => {
        MongoCliente.connect(uri)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}
