exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('users', function (table)
    {
        table.increments('id').primary();
        table.string('first_name', 20).notNullable();
        table.string('last_name', 30).notNullable();
        table.string('email', 70).notNullable().unique();
        table.string('salt').notNullable();
        table.string('password').notNullable().comment('hashed password');
        table.string('phone');
        table.string('mobile');
        table.integer('adress_id').unsigned();
        table.foreign('adress_id').references('adresses.id');
        table.string('profilepicture').comment('path to profile picture');
        table.timestamps(false, true);
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('users');

};
