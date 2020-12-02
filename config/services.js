module.exports.production = {
    mongodb: {
        "dbName": "<database>",
        // Every collection should have a URI to use
        // Look at the config/init_db_scripts/mongo-initdb.js script to see how these users were created
        // we can connect to "mongo:27017" because docker will resolve the "mongo" service to some internal host
        "Users": {
            uri: "mongodb://<username>:<password>@mongo:27017/<database>",
            collection: 'users'
        },
        "Sessions": {
            uri: "mongodb://<username>:<password>@mongo:27017/<database>",
            collection: 'sessions',
            connectionOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        }
    },
    server: {
        log_path: "/var/logs/server",
        port: "8080",       // This is the port INSIDE the docker container. It must be mapped to a local network port to receive any data
        session_secret: "<my_super_secret_key>",
        cookie_secret: "<my_super_secret_key>"
    }
};


module.exports.development = {
    mongodb: {
        "dbName": "test",
        "Users": {
            uri: "mongodb://<username>:<password>@mongo:27017/<database>",
            collection: 'users'
        },
        "Sessions": {
            uri: "mongodb://<username>:<password>@mongo:27017/<database>",
            collection: 'sessions',
            connectionOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        }
    },
    server: {
        log_path: "/var/logs/server",
        port: "8080",
        session_secret: "test",
        cookie_secret: "test"
    }
};