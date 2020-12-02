/**
 * @file mongo-initdb.js
 * @fileOverview
 * Used to initialize the database
 * This script is run by Mongo when the database is created for the FIRST TIME ONLY
 * Any changes here will require the database to be destroyed and recreated before being applied
 */

/**
 * Create custom roles
 * We use these to enforce collection-level access control
 */
db.createRole({
    role: "<collection>-handler",
    privileges: [
        {
            resource: {
                db: '<database>',
                collection: '<collection>'
            },
            actions: [
                'find', 'insert', 'remove', 'update',
                'bypassDocumentValidation', 'useUUID', 'killCursors',
                'collStats', 'dbHash', 'dbStats',
                'listIndexes', 'validate'
            ]
        }
    ]
});


/**
 * Create Admin user for full access to db
 */
db.createUser(
    {
        user: "<user for database which shall be created>",
        pwd: "<password of user>",
        roles: [
            {
                role: "dbOwner",
                db: "<database to create>"
            }
        ]
    }
);


/**
 * Collection-level access users
 * These users are created to minimize changes to multiple collections directly
 */
db.createUser(
    {
        user: "<user for database which shall be created>",
        pwd: "<password of user>",
        roles: [
            {
                role: "<collection>-handler", // collection-based access control
                db: "<database to create>"
            }
        ]
    }
);