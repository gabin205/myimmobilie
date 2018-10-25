'use strict';

const Model = require('objection').Model;

class Adress
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'adresses';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            properties: {
                id        : {type: 'integer'},
                name      : {type: 'string', minLength: 2, maxLength: 50},
                zipcode_id: {type: 'integer'}
            }
        }
    }

    static get relationMappings()
    {
        return {
            zipcode: {
                relation  : Model.HasOneRelation,
                modelClass: __dirname + '/Zipcode',
                join      : {
                    from: 'adresses.zipcode_id',
                    to  : 'zipcodes.id'
                }
            },
            user   :
                {
                    relation  : Model.HasOneRelation,
                    modelClass: __dirname + '/User',
                    join      : {from: 'adresses.id', to: 'users.id'}
                },
        }
    }
}

module.exports = Adress;
