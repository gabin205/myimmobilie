exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('permissions', function (table)
    {
        table.increments('id').primary();
        table.string('name', 30).notNullable();
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('permissions');
};
