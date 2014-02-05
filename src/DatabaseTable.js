function DatabaseTable() {
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
