var collection_user_actions = [
  'find', 'insert', 'remove', 'update', 'bypassDocumentValidation', 'useUUID',
  'dropIndex', 'reIndex',
  'collStats', 'connPoolStats', 'dbHash', 'dbStats',
  'indexStats', 'createIndex', 'listIndexes', 'validate'
];

db.createRole({
  role: "clients-handler",
  roles: [],
  privileges: [
    {
      resource: {
        db: 'primetracking',
        collection: 'clients'
      },
      actions: collection_user_actions
    }
  ]
});

db.createRole({
  role: "devices-handler",
  roles: [],
  privileges: [
    {
      resource: {
        db: 'primetracking',
        collection: 'devices'
      },
      actions: collection_user_actions
    }
  ]
});

db.createRole({
  role: "subscriptions-handler",
  roles: [],
  privileges: [
    {
      resource: {
        db: 'primetracking',
        collection: 'subscriptions'
      },
      actions: collection_user_actions
    }
  ]
});

db.createRole({
  role: "wialon-users-handler",
  roles: [],
  privileges: [
    {
      resource: {
        db: 'primetracking',
        collection: 'wialon_users'
      },
      actions: collection_user_actions
    }
  ]
});

db.createRole({
  role: "stripe-customers-handler",
  roles: [],
  privileges: [
    {
      resource: {
        db: 'primetracking',
        collection: 'stripe_customers'
      },
      actions: collection_user_actions
    }
  ]
});

db.createRole({
  role: "woocommerce-customers-handler",
  roles: [],
  privileges: [
    {
      resource: {
        db: 'primetracking',
        collection: 'woocommerce_customers'
      },
      actions: collection_user_actions
    }
  ]
});