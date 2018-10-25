exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('rateable', function (table)
    {
        table.increments('id').primary();
        table.integer('user_id').unsigned().index();
        table.foreign('user_id').references('users.id');
        table.string('rateable_type', 50).notNullable().index();
        table.integer('rateable_id').unsigned().index();
        table.decimal('rating').unsigned();
        table.text('comment');
        table.timestamps()
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('rateable');

};
