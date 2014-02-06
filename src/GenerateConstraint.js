function GenerateConstraint(type) {
    angular.extend(this, new DatabaseConstraint());

    this.create = function (database, name, table_name, field_name) {
        new DatabaseFile().addConstraint(database, {
            name: name,
            type: type,
            table_name: table_name,
            field_name: field_name,
            current: 1,
            step: 1
        });
    };

    this.preTableInsert = function (database, constraint_data, table_name, inserting) {
        if (table_name !== constraint_data.table_name) {
            return;
        }

        if (!inserting.hasOwnProperty(constraint_data.field_name)) {
            inserting[constraint_data.field_name] = constraint_data.current;
            constraint_data.current += constraint_data.step;
        }
    };
}
