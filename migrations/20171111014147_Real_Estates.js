exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('real_estates', function (table)
    {
        table.increments('id').primary();
        table.integer('adress_id').unsigned();
        table.foreign('adress_id').references('adresses.id');
        table.integer('owner_id').unsigned().index();
        table.foreign('owner_id').references('users.id');
        table.integer('seller_id').unsigned().index();
        table.foreign('seller_id').references('users.id');
        table.string('header',40).notNullable();
        table.text('description').notNullable();
        table.decimal ('size').comment('quadratmeter');
        table.decimal ('cost').comment('preis');
        table.decimal ('running_cost').comment('nebenkosten');
        table.boolean('isActive').default(0);
        table.datetime('build_at').comment('maybe change to varchar/number for year');
        table.timestamps(false, true);
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('real_estates');

};
