function DatabaseQuery() {
    var operations = {
        const: function (record, op) {
            return op.value;
        },
        value: function (record, op) {
            return record[op.value];
        },
        eq: function (record, op) {
            return this[op.lhs.op](record, op.lhs) === this[op.rhs.op](record, op.rhs);
        },
        gt: function (record, op) {
            return this[op.lhs.op](record, op.lhs) > this[op.rhs.op](record, op.rhs);
        },
        gte: function (record, op) {
            return this[op.lhs.op](record, op.lhs) >= this[op.rhs.op](record, op.rhs);
        },
        lt: function (record, op) {
            return this[op.lhs.op](record, op.lhs) < this[op.rhs.op](record, op.rhs);
        },
        lte: function (record, op) {
            return this[op.lhs.op](record, op.lhs) <= this[op.rhs.op](record, op.rhs);
        },
        not: function (record, op) {
            return !this[op.value.op](record, op.value);
        },
        and: function (record, op) {
            for (var i in op.value) {
                if (!this[op.value[i].op](record, op.value[i])) {
                    return false;
                }
            }

            return true;
        },
        or: function (record, op) {
            for (var i in op.value) {
                if (this[op.value[i].op](record, op.value[i])) {
                    return true;
                }
            }

            return false;
        }
    };

    this.make = function (table_name) {
        return {
            from: table_name
        }
    };

    this.execute = function (database, query) {
        return database.tables[query.from].records.filter(function (record) {
            if (query.where && !operations[query.where.op](record, query.where)) {
                return false;
            }

            return true;
        });
    };
}