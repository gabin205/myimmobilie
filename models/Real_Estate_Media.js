'use strict';

const Model = require('objection').Model;

class Real_Estate_Media
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'real_estate_medias';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            properties: {
                id        : {type: 'integer'},
                estate_id : {type: 'integer'},
                path      : {type: 'string'},
                created_at: {type: 'string'},
                updated_at: {type: 'string'},
                type      : {type: 'string', enum: ['video', 'picture']},
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
                    from: 'real_estate_medias.estate_id',
                    to  : 'real_estates.id'
                }
            }
        }
    }
}

module.exports = Real_Estate_Media;
