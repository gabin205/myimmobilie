exports.up = function (knex, Promise)
{
    return knex.schema.table('messages', function (table)
    {
        table.integer('parent_id').unsigned().notNullable();
        table.foreign('parent_id').references('messages.id')
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.table('messages', function (table)
    {
        table.dropIndex('parent_id');
        table.dropColumn('parent_id');
    });

};
