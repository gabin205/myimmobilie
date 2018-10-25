'use strict';

const Model = require('objection').Model;

class Favorable
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'favorable';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            properties: {
                id            : {type: 'integer'},
                user_id       : {type: 'integer'},
                favorable_type: {type: 'string', minLength: 2, maxLength: 50,},
                favorable_id  : {type: 'integer'},
            }
        }
    }

    static get relationMappings()
    {
        return {
            user: {
                relation  : Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join      : {
                    from: 'favorable.user_id',
                    to  : 'users.id'
                }
            },

            real_estate: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Real_Estate',
                join : {
                    from: 'favorable.favorable_id',
                    to : 'real_estates.id'
                }
            }
        }
    }
}

module.exports = Favorable;
