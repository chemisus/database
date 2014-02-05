function DatabaseConstraint() {
    this.preTableInsert = function (database, constraint_data, table_name, inserting) {
    };

    this.postTableInsert = function (database, constraint_data, table_name, inserted) {
    };

    this.preTableUpdate = function (database, constraint_data, table_name, old, updating) {
    };

    this.postTableUpdate = function (database, constraint_data, table_name, old, updated) {
    };

    this.preTableDelete = function (database, constraint_data, table_name, deleting) {
    };

    this.postTableDelete = function (database, constraint_data, table_name, deleted) {
    };

    this.preDatabaseInsert = function (database, constraint_data, table_name, inserting) {
    };

    this.postDatabaseInsert = function (database, constraint_data, table_name, inserted) {
    };

    this.preDatabaseUpdate = function (database, constraint_data, table_name, old, updating) {
    };

    this.postDatabaseUpdate = function (database, constraint_data, table_name, old, updated) {
    };

    this.preDatabaseDelete = function (database, constraint_data, table_name, deleting) {
    };

    this.postDatabaseDelete = function (database, constraint_data, table_name, deleted) {
    };
}
