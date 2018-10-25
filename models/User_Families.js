'use strict';

const Model = require('objection').Model;

class User_Families
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'user_families';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            required  : ['type', 'age', 'usePublicTransport'],
            properties: {
                id                : {type: 'integer'},
                type              : {type: 'string', enum: ['kid', 'wife', 'husband']},
                age               : {type: 'integer', minimum: 0, maximum: 120},
                usePublicTransport: {type: 'integer', minimum: 0, maximum: 1},
                name              : {type: 'string', minLength: 2, maxLength: 20},
                user_id           : {type: 'integer'},
                adress_id         : {type: 'integer'}

            }
        }
    }

    static get relationMappings()
    {
        return {
            adress: {
                relation  : Model.HasOneRelation,
                modelClass: __dirname + '/Adress',
                join      : {
                    from: 'user_families.adress_id',
                    to  : 'adresses.id'
                }
            },
            user  : {
                relation  : Model.HasManyRelation,
                modelClass: __dirname + '/User',
                join      : {
                    from: 'user_families.user_id',
                    to  : 'users.id'
                }
            }
        }
    }
}

module.exports = User_Families;
