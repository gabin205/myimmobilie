exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('real_estate_medias', function (table)
    {
        table.increments('id').primary();
        table.enu('type', ['video', 'picture']).index();
        table.string('path').comment('path to file');
        table.integer('estate_id').unsigned().index();
        table.foreign('estate_id').references('real_estates.id');
        table.timestamps(false, true);
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('real_estate_medias');

};
