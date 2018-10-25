exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('real_estate_equipments', function (table)
    {
        table.increments('id').primary();
        table.integer('real_estate_id').unsigned().index();
        table.foreign('real_estate_id').references('real_estates.id');
        table.integer('real_estate_equipment_id').unsigned().index();
        table.foreign('real_estate_equipment_id').references('real_estate_equipment.id');
        table.timestamps();
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('real_estate_equipments');
};
