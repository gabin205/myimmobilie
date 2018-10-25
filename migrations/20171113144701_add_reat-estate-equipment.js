exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('real_estate_equipment', function (table)
    {
        table.increments('id').primary();
        table.enu('equipment_type',['equipment','parking','floor','heating','object_type']).index();
        table.string('equipment_name').unique();
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('real_estate_equipment');
};
