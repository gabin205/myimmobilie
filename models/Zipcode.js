'use strict';

const Model = require('objection').Model;

class Zipcode
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'zipcodes';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            properties: {
                id      : {type: 'integer'},
                zipcode : {type: 'string', minLength: 3, maxLength: 5},
                location: {type: 'string', minLength: 2, maxLength: 80},
            }
        }
    }

    static get relationMappings()
    {
        return {
            adresses: {
                relation  : Model.HasOneRelation,
                modelClass: __dirname + '/Adress',
                join      : {
                    from: 'zipcodes.id',
                    to  : 'adresses.zipcode_id'
                }
            }
        }
    }
}

module.exports = Zipcode;
