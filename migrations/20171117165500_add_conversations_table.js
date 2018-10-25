exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('message_conversations', function (table)
    {
        table.increments('id').primary();
        table.integer('msg_id').index();
        //table.foreign('msg_id').references('messages.id');
        table.timestamps();
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('message_conversations');
};
