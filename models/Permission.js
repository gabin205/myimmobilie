'use strict';

const Model = require('objection').Model;

class Permission
    extends Model
{
    static get modelPaths() {
        return [__dirname];
    }
    static get tableName()
    {
        return 'permissions';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            required  : ['name'],
            properties: {
                id  : {type: 'integer'},
                name: {type: 'string', minLength: 2, maxLength: 30}
            }
        }
    }

    static get relationMappings()
    {
        return {
            roles: {
                relation  : Model.ManyToManyRelation,
                modelClass: __dirname + '/Role',
                join      : {
                    from   : 'permissions.id',
                    through: {from: 'role_permissions.permission_id', to: 'role_permissions.role_id'},
                    to     : 'roles.id'
                }
            }
        }
    }
}

module.exports = Permission;
