exports.up = function (knex, Promise)
{
    return knex.schema.table('messages', function (t)
    {
        t.integer('conversation_id').unsigned().index();
        t.foreign('conversation_id').references('message_conversations.id');
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.table('messages', function (t)
    {
        t.dropColumn('conversation_id');
    });
};