exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('user_roles', function (table)
    {
        table.increments('id').primary();
        table.integer('user_id').unsigned().index();
        table.foreign('user_id').references('users.id');
        table.integer('role_id').unsigned().index();
        table.foreign('role_id').references('roles.id');
        table.timestamps(false, true);
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('user_roles');

};
