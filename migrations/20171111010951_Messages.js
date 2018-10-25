exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('messages', function (table)
    {
        table.increments('id').primary();
        table.enu('type', ['message', 'agent_contact', 'appointment']).index();
        table.string('header', 50).notNullable();
        table.text('body').notNullable();
        table.integer('sender_id').unsigned();
        table.foreign('sender_id').references('users.id');
        table.integer('receiver_id').unsigned();
        table.foreign('receiver_id').references('users.id');
        table.datetime('sent_at').defaultTo(knex.fn.now());
        table.datetime('received_at');
        table.timestamps(false, true);
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('messages');

};
