exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('message_conversation_participants', function (table)
    {
        table.increments('id').primary();
        table.integer('conversation_id').unsigned().index();
        table.foreign('conversation_id').references('message_conversations.id');
        table.integer('receiver_id').unsigned().index();
        table.foreign('receiver_id').references('users.id');
        table.integer('sender_id').unsigned().index();
        table.foreign('sender_id').references('users.id');
        table.timestamp('appointment').notNullable().index();
        table.timestamps();
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('message_participants');
};
