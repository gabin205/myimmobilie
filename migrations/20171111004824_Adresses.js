exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('adresses', function (table)
    {
        table.increments('id').primary();
        table.string('street', 50).notNullable();
        table.string('zipcode', 5).notNullable();
        table.string('location', 50).notNullable();
        table.string('district');
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('adresses');

};
