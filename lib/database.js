(function () {
    var app = angular.module('DatabaseApp', []);

    app.run([
        '$rootScope',
        'database',
        function ($rootScope, database) {
            $rootScope.database = database;
        }
    ]);

    app.value('database_name', 'test');

    app.value('database_drop', false);

    app.service('DatabaseFile', DatabaseFile);

    app.service('DatabaseTable', DatabaseTable);

    app.service('DatabaseMigration', DatabaseMigration);

    app.factory('database', [
        '$log',
        'DatabaseFile',
        'constraints',
        'migrations',
        'database_name',
        'database_drop',
        function ($log, DatabaseFile, constraints, migrations, database_name, database_drop) {
            if (database_drop) {
                $log.info('dropping database ' + database_name);

                DatabaseFile.dropDatabase(database_name);
            }

            var database = DatabaseFile.loadDatabase(database_name) || DatabaseFile.initDatabase(database_name);

            DatabaseFile.migrateDatabase(database, constraints, migrations);

            return database;
        }
    ]);

    app.factory('constraints', [
        function () {
            return {
                generate: new GenerateConstraint('generate'),
                unique: new UniqueConstraint('unique'),
                save_database: new SaveDatabaseConstraint('save_database')
            };
        }
    ]);

    app.factory('migrations', [
        'DatabaseTable',
        'DatabaseMigration',
        function (DatabaseTable, DatabaseMigration) {
            return [
                DatabaseMigration.create(function (database, constraints) {
                    constraints['save_database'].create(database, 'db_save');
                }),
                DatabaseMigration.create(function (database, constraints) {
                    DatabaseTable.create(database, 'table1');
                    constraints['generate'].create(database, 'table1_generate', 'table1', 'id');
                    constraints['unique'].create(database, 'table1_unique', 'table1', 'id');
                }),
                DatabaseMigration.create(function (database, constraints) {
                    DatabaseTable.create(database, 'table2');
                    constraints['generate'].create(database, 'table2_generate', 'table2', 'id');
                    constraints['unique'].create(database, 'table2_unique', 'table2', 'id');
                }),
                DatabaseMigration.create(function (database, constraints) {
                    DatabaseTable.create(database, 'table3');
                    constraints['generate'].create(database, 'table3_generate', 'table3', 'id');
                    constraints['unique'].create(database, 'table3_unique', 'table3', 'id');
                })
            ];
        }
    ]);

})();
