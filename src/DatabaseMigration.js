function DatabaseMigration() {
    this.create = function (up, down) {
        return {
            up: up || function () {

            },
            down: down || function () {

            }
        };
    };
}
