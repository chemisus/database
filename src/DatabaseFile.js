function DatabaseFile() {
    this.initDatabase = function (database_name) {
        return {
            name: database_name,
            migration: 0,
            constraints: {
            },
            constraint_keys: [
            ],
            tables: {
            }
        };
    };

    this.saveDatabase = function (database) {
        localStorage.setItem(database.name, angular.toJson(database));
    };

    this.loadDatabase = function (database_name) {
        if (!localStorage.getItem(database_name)) {
            return null;
        }

        return angular.fromJson(localStorage.getItem(database_name));
    };

    this.dropDatabase = function (database_name) {
        localStorage.removeItem(database_name);
    };

    this.hasTable = function (database, table_name) {
        return database.tables.hasOwnProperty(table_name);
    };

    this.migrateDatabase = function (database, constraints, migrations) {
        for (; database.migration < migrations.length; database.migration++) {
            migrations[database.migration].up(database, constraints);
        }

        this.saveDatabase(database);
    };

    this.addConstraint = function (database, constraint) {
        database.constraints[constraint.name] = constraint;
        database.constraint_keys.push(constraint.name);
    };
}
