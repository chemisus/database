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

    this.callConstraint = function (method, database, constraints, table_name, record) {
        for (var i in database.constraint_keys) {
            var constraint_data = this.getConstraintData(database, i);
            var constraint = this.getConstraint(database, constraint_data, constraints);

            constraint[method](database, constraint_data, table_name, record);
        }
    };

    this.select = function (database, constraints, table_name, query) {
        query = {
            from: 'table1',
            where: {
                op: 'or',
                value: [
                    {
                        op: 'eq',
                        field: 'id',
                        value: {
                            op: 'const',
                            value: 9
                        }
                    },
                    {
                        op: 'eq',
                        field: 'id',
                        value: {
                            op: 'const',
                            value: 5
                        }
                    }
                ]
            }
        };
    };

    this.insert = function (database, constraints, table_name, record) {
        var table = database.tables[table_name];

        this.callConstraint('preDatabaseInsert', database, constraints, table_name, record);
        this.callConstraint('preTableInsert', database, constraints, table_name, record);

        table.records.push(record);

        this.callConstraint('postTableInsert', database, constraints, table_name, record);
        this.callConstraint('postDatabaseInsert', database, constraints, table_name, record);
    };

    this.delete = function (database, constraints, table_name, record) {
        var table = database.tables[table_name];

        this.callConstraint('preDatabaseDelete', database, constraints, table_name, record);
        this.callConstraint('preTableDelete', database, constraints, table_name, record);

        var index = table.records.indexOf(record);

        if (index !== -1) {
            table.records.splice(index, 1);
        }

        this.callConstraint('postTableDelete', database, constraints, table_name, record);
        this.callConstraint('postDatabaseDelete', database, constraints, table_name, record);
    };
}
