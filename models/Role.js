'use strict';

const Model      = require('objection').Model;

class Role
    extends Model
{
    static get modelPaths() {
        return [__dirname];
    }
    static get tableName()
    {
        return 'roles';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            properties: {
                id  : {type: 'integer'},
                name: {type: 'string', minLength: 2, maxLength: 30}
            }
        }
    }

    static get relationMappings()
    {
        return {
            permissions: {
                relation  : Model.ManyToManyRelation,
                modelClass: __dirname + '/Permission',
                join      :
                    {
                        from   : 'roles.id',
                        through:
                            {
                                to  : 'role_permissions.permission_id',
                                from: 'role_permissions.role_id'
                            },
                        to     : 'permissions.id'
                    }
            },
            users      :
                {
                    //relation  : Model.manyToManyConnections,
                    relation  : Model.ManyToManyRelation,
                    modelClass: __dirname + '/User',
                    join      :
                        {
                            from   : 'roles.id',
                            through:
                                {
                                    to  : 'user_roles.role_id',
                                    from: 'user_roles.user_id'
                                },
                            to     : 'users.id'
                        }
                }
        }
    }
}

module.exports = Role;
