/**
 *
 * @param database
 * @param constraints
 * @param {DatabaseQuery} database_query
 * @param query
 * @constructor
 */
function DatabaseQueryBuilder(database, constraints, database_query, query) {
    this.execute = function () {
        return database_query.execute(database, query);
    };

    this.const = function (value) {
        return {
            op: 'const',
            value: value
        };
    };

    this.value = function (value) {
        return {
            op: 'value',
            value: value
        };
    };

    this.where = function (value) {
        query.where = value;

        return this;
    };

    this.eq = function (lhs, rhs) {
        return {
            op: 'eq',
            lhs: lhs,
            rhs: rhs
        };

        return this;
    };

    this.gt = function (lhs, rhs) {
        return {
            op: 'gt',
            lhs: lhs,
            rhs: rhs
        };

        return this;
    };

    this.gte = function (lhs, rhs) {
        return {
            op: 'gte',
            lhs: lhs,
            rhs: rhs
        };

        return this;
    };

    this.lt = function (lhs, rhs) {
        return {
            op: 'lt',
            lhs: lhs,
            rhs: rhs
        };

        return this;
    };

    this.lte = function (lhs, rhs) {
        return {
            op: 'lte',
            lhs: lhs,
            rhs: rhs
        };

        return this;
    };

    this.or = function (value) {
        return {
            op: 'or',
            value: value
        }
    };

    this.and = function (value) {
        return {
            op: 'and',
            value: value
        }
    };

    this.not = function (value) {
        return {
            op: 'not',
            value: value
        };
    };
}
