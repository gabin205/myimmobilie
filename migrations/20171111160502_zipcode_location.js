exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('zipcodes', function (table)
    {
        table.increments('id').primary();
        table.string('zipcode',5).index();
        table.string('location',80).index();
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('zipcodes');

};
