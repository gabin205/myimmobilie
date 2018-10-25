exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('roles', function (table)
    {
        table.increments('id').primary();
        table.string('name', 30).notNullable();
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('roles');

};
