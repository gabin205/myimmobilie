exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('favorable', function (table)
    {
        table.increments('id').primary();
        table.integer('user_id').unsigned().index();
        table.foreign('user_id').references('users.id');
        table.string('favorable_type',50).notNullable().index();
        table.integer('favorable_id').unsigned().index();
        table.timestamps()
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('favorable');

};
