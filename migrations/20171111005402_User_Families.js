exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('user_families', function (table)
    {
        table.increments('id').primary();
        table.enu('type', ['kid', 'wife', 'husband']).notNullable();
        table.integer('age');
        table.boolean('usePublicTransport').default(1);
        table.integer('adress_id').unsigned();
        table.foreign('adress_id').references('adresses.id');
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('user_families');

};
