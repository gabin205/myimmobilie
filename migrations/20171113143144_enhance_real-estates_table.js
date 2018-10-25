exports.up = function (knex, Promise)
{
    return knex.schema.table('user_families', function (t)
    {
        t.integer('rooms').unsigned();
        t.string('energy_efficiency',2).default('NA').index(); // https://www.effizienzhaus-online.de/energieeffizienzklasse
        //t.enu('object_type',['detached','multi-family','two-family','semidetached','terraced','villa','country','farm']);
        //t.enu('heating_type',['solar','oil','pellet','gas','wood','electro','district_heating']);
        //t.enu('floor_type',['tiles','wood','laminate','parquet','pvc']);
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.table('user_families', function (t)
    {
        t.dropColumn('rooms');
        t.dropColumn('energy_efficiency');
        //t.dropColumn('object_type');
        //t.dropColumn('heating_type');
        //t.dropColumn('floor_type');
    });
};