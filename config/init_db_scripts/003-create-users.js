db.createUser(
  {
    user: "primetracking-app",
    pwd: "test",
    roles: [
      {
        role: "dbOwner",
        db: "primetracking"
      }
    ]
  }
);
db.createUser(
  {
    user: "primetracking-sessions",
    pwd: "test",
    roles: [
      {
        role: "readWrite",
        db: "primetracking"
      }
    ]
  }
);

db.createUser(
  {
    user: "primetracking-clients",
    pwd: "test",
    roles: [
      {
        role: "clients-handler",
        db: "primetracking"
      }
    ]
  }
);

db.createUser(
  {
    user: "primetracking-devices",
    pwd: "test",
    roles: [
      {
        role: "devices-handler",
        db: "primetracking"
      }
    ]
  }
);

db.createUser(
  {
    user: "primetracking-subscriptions",
    pwd: "test",
    roles: [
      {
        role: "subscriptions-handler",
        db: "primetracking"
      }
    ]
  }
);

db.createUser(
  {
    user: "primetracking-wialon-users",
    pwd: "test",
    roles: [
      {
        role: "wialon-users-handler",
        db: "primetracking"
      }
    ]
  }
);

db.createUser(
  {
    user: "primetracking-stripe-customers",
    pwd: "test",
    roles: [
      {
        role: "stripe-customers-handler",
        db: "primetracking"
      }
    ]
  }
);

db.createUser(
  {
    user: "primetracking-woocommerce-customers",
    pwd: "test",
    roles: [
      {
        role: "woocommerce-customers-handler",
        db: "primetracking"
      }
    ]
  }
);