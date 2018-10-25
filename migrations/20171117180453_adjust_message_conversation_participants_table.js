exports.up = function (knex, Promise)
{
    return knex.schema.table('message_conversation_participants', function (t)
    {
        t.dropForeign('receiver_id');
        t.dropIndex('receiver_id');
        t.dropForeign('sender_id');
        t.dropIndex('sender_id');
        t.dropColumn('receiver_id');
        t.dropColumn('sender_id');
        t.dropIndex(['receiver_id', 'sender_id'])
        t.integer('user_id').unsigned().index();
        t.foreign('user_id').references('users.id');
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.table('message_conversation_participants', function (t)
    {
        t.dropForeign('user_id');
        t.dropIndex('user_id');
        t.dropColumn('user_id');
        t.integer('receiver_id').unsigned().index();
        t.foreign('receiver_id').references('users.id');
        t.integer('sender_id').unsigned().index();
        t.foreign('sender_id').references('users.id');
    });
};
