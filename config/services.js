module.exports.production = {
  mongodb: {
    "dbName": "primetracking",
    // Every collection should have a URI to use
    // Look at the config/init_db_scripts/mongo-initdb.js script to see how these users were created
    // we can connect to "mongo:27017" because docker will resolve the "mongo" service to some internal host
    "Clients": {
      uri: "mongodb://primetracking-clients:<password>@mongo:27017/primetracking",
      collection: 'clients'
    },
    "Devices": {
      uri: "mongodb://primetracking-devices:<password>@mongo:27017/primetracking",
      collection: 'devices'
    },
    "Subscriptions": {
      uri: "mongodb://primetracking-subscriptions:<password>@mongo:27017/primetracking",
      collection: 'subscriptions'
    },
    "WialonUsers": {
      uri: "mongodb://primetracking-wialon-users:<password>@mongo:27017/primetracking",
      collection: 'wialon_users'
    },
    "StripeCustomers": {
      uri: "mongodb://primetracking-stripe-customers:<password>@mongo:27017/primetracking",
      collection: 'stripe_customers'
    },
    "WooCommerceCustomers": {
      uri: "mongodb://primetracking-woocommerce-customers:<password>@mongo:27017/primetracking",
      collection: 'woocommerce_customers'
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
    cookie_secret: "<my_super_secret_key>"
  }
};


module.exports.development = {
  mongodb: {
    "dbName": "primetracking",
    "Clients": {
      uri: "mongodb://primetracking-clients:test@mongo:27017/primetracking",
      collection: 'clients'
    },
    "Devices": {
      uri: "mongodb://primetracking-devices:test@mongo:27017/primetracking",
      collection: 'devices'
    },
    "Subscriptions": {
      uri: "mongodb://primetracking-subscriptions:test@mongo:27017/primetracking",
      collection: 'subscriptions'
    },
    "WialonUsers": {
      uri: "mongodb://primetracking-wialon-users:test@mongo:27017/primetracking",
      collection: 'wialon_users'
    },
    "StripeCustomers": {
      uri: "mongodb://primetracking-stripe-customers:test@mongo:27017/primetracking",
      collection: 'stripe_customers'
    },
    "WooCommerceCustomers": {
      uri: "mongodb://primetracking-woocommerce-customers:test@mongo:27017/primetracking",
      collection: 'woocommerce_customers'
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
    port: "8080",
    session_secret: "test",
    cookie_secret: "test"
  }
};