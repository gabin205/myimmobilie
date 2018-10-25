exports.up = function (knex, Promise)
{
    return knex.schema.table('user_roles', function (t)
    {
        t.integer('agency_id').unsigned().index().default(0);
        t.foreign('agency_id').references('real_estate_agencies.id');
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.table('message_conversation_participants', function (t)
    {
        t.dropForeign('agency_id');
        t.dropIndex('agency_id');
        t.dropColumn('agency_id');
    });
};
