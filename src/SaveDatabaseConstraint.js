function SaveDatabaseConstraint(type) {
    angular.extend(this, new DatabaseConstraint());

    this.create = function (database, name) {
        database.constraints[name] = {
            name: name,
            type: type
        };
    };

    this.postDatabaseInsert = function (database, constraint_data, table_name, inserted) {
        new DatabaseFile().saveDatabase(database);
    };

    this.postDatabaseUpdate = function (database, constraint_data, table_name, old, updated) {
        new DatabaseFile().saveDatabase(database);
    };

    this.postDatabaseDelete = function (database, constraint_data, table_name, deleted) {
        new DatabaseFile().saveDatabase(database);
    };
}
