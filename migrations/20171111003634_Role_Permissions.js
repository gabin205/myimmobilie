exports.up = function (knex, Promise)
{
    return knex.schema.createTableIfNotExists('role_permissions', function (table)
    {
        table.increments('id').primary();
        table.integer('role_id').unsigned();
        table.foreign('role_id').references('roles.id');
        table.integer('permission_id').unsigned();
        table.foreign('permission_id').references('permissions.id');
//        table.integer('agency_id').unsigned().default(0).comment('can be used to identify an real estate agents agency');
        table.timestamps(false,true);
    });
};

exports.down = function (knex, Promise)
{
    return knex.schema.dropTableIfExists('role_permissions');

};
