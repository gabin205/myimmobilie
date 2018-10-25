exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('sessions', function (table)
    {
        table.increments('id').primary();
        table.string('sid',255).notNullable().index();
        table.text('sess').notNullable();
        table.timestamp('expired').notNullable();
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('sessions');

};
