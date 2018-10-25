exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('real_estate_advertisements', function (table)
    {
        table.increments('id').primary();
        table.integer('real_estate_id').unsigned().index();
        table.foreign('real_estate_id').references('real_estates.id');
        table.integer('user_id').unsigned().index();
        table.foreign('user_id').references('users.id');
        table.timestamp('active_from').index();
        table.timestamp('active_to').index();
        table.string('description',255);
        table.timestamps();
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('real_estate_advertisements');

};
