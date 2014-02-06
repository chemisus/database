function DatabaseTable() {
    this.create = function (database, table_name) {
        database.tables[table_name] = {
            name: table_name,
            records: []
        };
    };

    this.getConstraintData = function (database, i) {
        var constraint_key = database.constraint_keys[i];
        return database.constraints[constraint_key];
    };

    this.getConstraint = function (database, constraint_data, constraints) {
        var constraint_type = constraint_data.type;
        return constraints[constraint_type];
    };

    this.insert = function (database, constraints, table_name, record) {
        var table = database.tables[table_name];

        for (var i in database.constraint_keys) {
            var constraint_data = this.getConstraintData(database, i);
            var constraint = this.getConstraint(database, constraint_data, constraints);

            constraint.preDatabaseInsert(database, constraint_data, table_name, record);
        }

        for (var i in database.constraint_keys) {
            var constraint_data = this.getConstraintData(database, i);
            var constraint = this.getConstraint(database, constraint_data, constraints);

            constraint.preTableInsert(database, constraint_data, table_name, record);
        }

        table.records.push(record);

        for (var i in database.constraint_keys) {
            var constraint_data = this.getConstraintData(database, i);
            var constraint = this.getConstraint(database, constraint_data, constraints);

            constraint.postTableInsert(database, constraint_data, table_name, record);
        }

        for (var i in database.constraint_keys) {
            var constraint_data = this.getConstraintData(database, i);
            var constraint = this.getConstraint(database, constraint_data, constraints);

            constraint.postDatabaseInsert(database, constraint_data, table_name, record);
        }
    };
}
