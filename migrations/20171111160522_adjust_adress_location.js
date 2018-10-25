exports.up = function (knex, Promise)
{
    return knex.schema.table('adresses', function (table)
    {
        table.dropColumn('zipcode');
        table.dropColumn('location');
        table.dropColumn('district');
        table.integer('zipcode_id').unsigned().notNullable();
        table.foreign('zipcode_id').references('zipcodes.id')
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.table('adresses',function (table)
    {
        table.string('zipcode', 5).notNullable();
        table.string('location', 50).notNullable();
        table.string('district');
    });

};
