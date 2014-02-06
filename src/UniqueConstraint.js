function UniqueConstraint(type) {
    angular.extend(this, new DatabaseConstraint());

    this.create = function (database, name, table_name, field_name) {
        new DatabaseFile().addConstraint(database, {
            name: name,
            type: type,
            table_name: table_name,
            field_name: field_name
        });
    };

    this.preTableInsert = function (database, constraint_data, table_name, inserting) {
        if (table_name !== constraint_data.table_name) {
            return;
        }

        var found = database.tables[table_name].records.filter(function (record) {
            return record[constraint_data.field_name] == inserting[constraint_data.field_name];
        });

        if (found.length > 0) {
            throw 'fails unique constraint';
        }
    };
}
