exports.up = function (knex, Promise)
{
    return knex.schema.table('searches', function (t)
    {
        t.dropColumn('search');
        t.dropColumn('type');
        t.dropColumn('min_size');
        t.dropColumn('max_size');
        t.dropColumn('min_price');
        t.dropColumn('max_price');
        t.dropColumn('min_rooms');
        t.dropColumn('max_rooms');
        t.json('search_json');
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.table('searches', function (t)
    {
        t.dropColumn('search_json');
        t.string('search', 40).notNullable().comment('gesuchert ausdruck - plz / ort');
        t.enu('type', ['house', 'apartment']);
        t.decimal('min_size');
        t.decimal('max_size');
        t.decimal('min_price');
        t.decimal('max_price');
        t.integer('min_rooms').unsigned();
        t.integer('max_rooms').unsigned();
    });
};