'use strict';

const Model = require('objection').Model;

class Real_Estate_Advertisement
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'real_estate_advertisements';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            required  : ['header', 'cost'],
            properties: {
                id            : {type: 'integer'},
                user_id       : {type: 'integer'},
                real_estate_id: {type: 'integer'},
                description   : {type: 'string'},
                created_at    : {type: 'string'},
                updated_at    : {type: 'string'},
                active_from   : {type: 'string'},
                active_to     : {type: 'string'},
            }
        }
    }

    static get relationMappings()
    {
        return {
            realty: {
                relation  : Model.BelongsToOneRelation,
                modelClass: __dirname + '/Real_Estate',
                join      : {
                    from: 'real_estate_advertisements.real_estate_id',
                    to  : 'real_estates.id'
                }
            },
            agent : {
                relation  : Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join      : {
                    from: 'real_estate_advertisements.user_id',
                    to  : 'users.id'
                }
            },
        }
    }
}

module.exports = Real_Estate_Advertisement;
