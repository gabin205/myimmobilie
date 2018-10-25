exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('real_estate_appointments', function (table)
    {
        table.increments('id').primary();
        table.integer('real_estate_id').unsigned().index();
        table.foreign('real_estate_id').references('real_estates.id');
        table.integer('agent_id').unsigned().index();
        table.foreign('agent_id').references('users.id');
        table.integer('user_id').unsigned().index();
        table.foreign('user_id').references('users.id');
        table.timestamp('appointment').notNullable().index();
        table.timestamps();
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('real_estate_equipments');
};
