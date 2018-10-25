'use strict';

const Model = require('objection').Model;

class Real_Estate_Agency
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'real_estate_agencies';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            required  : ['name', 'register_court', 'register_number'],
            properties: {
                id             : {type: 'integer'},
                adress_id      : {type: 'integer'},
                manager_id     : {type: 'integer'}, // what user is allowed to manage this agency
                name           : {type: 'string', minLength: 2, maxLength: 30},
                phone          : {type: 'string'},
                mobile         : {type: 'string'},
                email          : {type: 'string'},
                register_court : {type: 'string'},
                register_number: {type: 'string'},
                website        : {type: 'string'},
                profilepicture : {type: 'string'},
            }
        }
    }

    static get relationMappings()
    {
        return {
            adress : {
                relation  : Model.HasOneRelation,
                modelClass: __dirname + '/Adress',
                join      : {
                    from: 'real_estate_agencies.adress_id',
                    to  : 'adresses.id'
                }
            },
            manager:
                {
                    relation  : Model.BelongsToOneRelation,
                    modelClass: __dirname + '/User',
                    join      : {
                        from: 'real_estate_agencies.manager_id',
                        to  : 'users.id'
                    }
                },
            agents :
                {
                    relation  : Model.ManyToManyRelation,
                    modelClass: __dirname + '/User',
                    join      : {
                        from   : 'real_estate_agencies.id',
                        through: {
                            from: 'user_roles.agency_id',
                            to  : 'user_roles.user_id'
                        },
                        to     : 'users.id'
                    }
                }
        }
    }
}

module.exports = Real_Estate_Agency;
