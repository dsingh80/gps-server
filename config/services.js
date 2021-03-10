module.exports.production = {
  mongodb: {
    "dbName": "primetracking",
    // Every collection should have a URI to use
    // Look at the config/init_db_scripts/mongo-initdb.js script to see how these users were created
    // we can connect to "mongo:27017" because docker will resolve the "mongo" service to some internal host
    "Clients": {
      uri: "mongodb://primetracking-collections:<password>@mongo:27017/primetracking",
      collection: 'clients'
    },
    "Devices": {
      uri: "mongodb://primetracking-collections:<password>@mongo:27017/primetracking",
      collection: 'devices'
    },
    "Subscriptions": {
      uri: "mongodb://primetracking-collections:<password>@mongo:27017/primetracking",
      collection: 'subscriptions'
    },
    "WialonUsers": {
      uri: "mongodb://primetracking-collections:<password>@mongo:27017/primetracking",
      collection: 'wialon_users'
    },
    "Sessions": {
      uri: "mongodb://primetracking-sessions:<password>@mongo:27017/primetracking",
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
    cookie_secret: "<my_super_secret_key>",
    MAX_LOGIN_ATTEMPTS: 5,
    PASSWORD_RESET_EXPIRATION: 1000 * 60 * 60
  }
};


module.exports.development = {
  mongodb: {
    "dbName": "primetracking",
    "Clients": {
      uri: "mongodb://primetracking-collections:test@mongo:27017/primetracking",
      collection: 'clients'
    },
    "Devices": {
      uri: "mongodb://primetracking-collections:test@mongo:27017/primetracking",
      collection: 'devices'
    },
    "Subscriptions": {
      uri: "mongodb://primetracking-collections:test@mongo:27017/primetracking",
      collection: 'subscriptions'
    },
    "WialonUsers": {
      uri: "mongodb://primetracking-collections:test@mongo:27017/primetracking",
      collection: 'wialon_users'
    },
    "Sessions": {
      uri: "mongodb://primetracking-sessions:test@mongo:27017/primetracking",
      collection: 'sessions',
      connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    }
  },
  server: {
    log_path: "/var/logs/server",
    port: "8443",
    session_secret: "test",
    cookie_secret: "test",
    MAX_LOGIN_ATTEMPTS: 5,
    PASSWORD_RESET_EXPIRATION: 1000 * 60 * 60
  }
};