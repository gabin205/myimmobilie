'use strict';

const Model = require('objection').Model;

class Search
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'searches';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            properties: {
                id         : {type: 'integer'},
                user_id    : {type: 'integer'},
                search_json: {type: 'string'}
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
                    from: 'searches.user_id',
                    to  : 'users.id'
                }
            }
        }
    }
}

module.exports = Search;
