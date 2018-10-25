exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('searches', function (table)
    {
        table.increments('id').primary();
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id');
        table.string('search',40).notNullable().comment('gesuchert ausdruck - plz / ort');
        //filters: maybe add more
        table.enu('type',['house','apartment']);
        table.decimal('min_size');
        table.decimal('max_size');
        table.decimal('min_price');
        table.decimal('max_price');
        table.integer('min_rooms').unsigned();
        table.integer('max_rooms').unsigned();
        table.timestamps(false, true);
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('searches');

};
