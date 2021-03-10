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
    user: "primetracking-collections",
    pwd: "test",
    roles: [
      {
        role: "clients-handler",
        db: "primetracking"
      },
      {
        role: "devices-handler",
        db: "primetracking"
      },
      {
        role: "subscriptions-handler",
        db: "primetracking"
      },
      {
        role: "wialon-users-handler",
        db: "primetracking"
      }
    ]
  }
);