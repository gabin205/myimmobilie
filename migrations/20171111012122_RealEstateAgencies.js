exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('real_estate_agencies', function (table)
    {
        table.increments('id').primary();
        table.string('name', 30).notNullable();
        table.integer('adress_id').unsigned().index();
        table.foreign('adress_id').references('adresses.id');
        table.string('phone');
        table.string('mobile');
        table.string('email', 70).notNullable().unique();
        table.string('register_court', 50).notNullable();
        table.string('register_number', 50).notNullable().unique();
        table.string('website', 50).notNullable();
        table.integer('manager_id').unsigned().index();
        table.foreign('manager_id').references('users.id');
        table.string('profilepicture');

    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('real_estate_agencies');

};
