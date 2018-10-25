exports.up = function (knex, Promise)
{
    return knex.schema.table('user_families', function (t)
    {
        t.integer('user_id').unsigned().index();
        t.foreign('user_id').references('users.id');
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.table('user_families', function (t)
    {
        t.dropColumn('user_id');
    });
};