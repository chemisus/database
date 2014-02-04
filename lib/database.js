function Database() {
    this.initDatabase = function (database_name) {
        return {
            name: database_name,
            migration: 0,
            constraints: {
            },
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
}

function Table() {
    this.create = function (database, table_name) {
        database.tables[table_name] = {
            name: table_name,
            constraints: [],
            records: []
        };
    };

    this.insert = function (database, constraints, table_name, record) {
        var table = database.tables[table_name];

        for (var i in database.constraints) {
            var constraint_data = database.constraints[i];
            var constraint_type = constraint_data.type;
            var constraint = constraints[constraint_type];

            constraint.preDatabaseInsert(database, constraint_data, table_name, record);
        }

        for (var i in table.constraints) {
            var constraint_name = table.constraints[i];
            var constraint_data = database.constraints[constraint_name];
            var constraint_type = constraint_data.type;
            var constraint = constraints[constraint_type];

            constraint.preTableInsert(database, constraint_data, table_name, record);
        }

        table.records.push(record);

        for (var i in table.constraints) {
            var constraint_name = table.constraints[i];
            var constraint_data = database.constraints[constraint_name];
            var constraint_type = constraint_data.type;
            var constraint = constraints[constraint_type];

            constraint.postTableInsert(database, constraint_data, table_name, record);
        }

        for (var i in database.constraints) {
            var constraint_data = database.constraints[i];
            var constraint_type = constraint_data.type;
            var constraint = constraints[constraint_type];

            constraint.postDatabaseInsert(database, constraint_data, table_name, record);
        }
    };
}

function Constraint() {
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

function UniqueConstraint() {
    angular.extend(this, new Constraint());

    this.create = function (database, name, table_name, field_name) {
        database.constraints[name] = {
            name: name,
            type: 'unique',
            table_name: table_name,
            field_name: field_name
        };

        database.tables[table_name].constraints.push(name);
    };

    this.preTableInsert = function (database, constraint_data, table_name, inserting) {
        var found = database.tables[table_name].records.filter(function (record) {
            return record[constraint_data.field_name] == inserting[constraint_data.field_name];
        });

        if (found.length > 0) {
            throw 'fails unique constraint';
        }
    };
}

function GenerateConstraint() {
    angular.extend(this, new Constraint());

    this.create = function (database, name, table_name, field_name) {
        database.constraints[name] = {
            name: name,
            type: 'generate',
            table_name: table_name,
            field_name: field_name,
            current: 1,
            step: 1
        };

        database.tables[table_name].constraints.push(name);
    };

    this.preTableInsert = function (database, constraint_data, table_name, inserting) {
        if (!inserting.hasOwnProperty(constraint_data.field_name)) {
            inserting[constraint_data.field_name] = constraint_data.current;
            constraint_data.current += constraint_data.step;
        }
    };
}

function SaveDatabaseConstraint() {
    angular.extend(this, new Constraint());

    this.create = function (database) {
        database.constraints[name] = {
            name: name,
            type: 'save_database'
        };
    };

    this.postDatabaseInsert = function (database, constraint_data, table_name, inserted) {
        new Database().saveDatabase(database);
    };

    this.postDatabaseUpdate = function (database, constraint_data, table_name, old, updated) {
        new Database().saveDatabase(database);
    };

    this.postDatabaseDelete = function (database, constraint_data, table_name, deleted) {
        new Database().saveDatabase(database);
    };
}

function Migration() {
    this.create = function (up, down) {
        return {
            up: up || function () {

            },
            down: down || function () {

            }
        };
    };
}

(function () {
    var app = angular.module('Database', []);

    app.run([
        '$rootScope',
        'Database',
        'Table',
        'constraints',
        function ($rootScope, Database, Table, constraints) {
//            Database.dropDatabase('test');

            var database = Database.loadDatabase('test') || Database.initDatabase('test');

            $rootScope.database = database;

            Database.migrateDatabase(database, constraints, [
                (new Migration).create(function (database, constraints) {
                    constraints['save_database'].create(database, 'db_save');
                }),
                (new Migration).create(function (database, constraints) {
                    Table.create(database, 'table1');
                    constraints['generate'].create(database, 'table1_generate', 'table1', 'id');
                    constraints['unique'].create(database, 'table1_unique', 'table1', 'id');
                }),
                (new Migration).create(function (database, constraints) {
                    Table.create(database, 'table2');
                    constraints['generate'].create(database, 'table2_generate', 'table2', 'id');
                    constraints['unique'].create(database, 'table2_unique', 'table2', 'id');
                }),
                (new Migration).create(function (database, constraints) {
                    Table.create(database, 'table3');
                    constraints['generate'].create(database, 'table3_generate', 'table3', 'id');
                    constraints['unique'].create(database, 'table3_unique', 'table3', 'id');
                }),
                (new Migration).create(function (database, constraints) {
                    Table.insert(database, constraints, 'table1', {});
                })
            ]);

            Table.insert(database, constraints, 'table1', {});
        }
    ]);

    app.service('Database', Database);

    app.service('Table', Table);

    app.factory('constraints', [
        function (Database, database) {
            return {
                generate: new GenerateConstraint(),
                unique: new UniqueConstraint(),
                save_database: new SaveDatabaseConstraint()
            };
        }
    ]);

})();
