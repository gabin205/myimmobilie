'use strict';

const Model = require('objection').Model;

class Rateable
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'rateable';
    }

    static get jsonSchema()
    {
        return {
            type: 'object',
            required: ['user_id', 'rateable_id', 'rating', 'rateable_type'],
            properties: {
                id: {type: 'integer'},
                user_id: {type: 'integer'},
                rateable_type: {type: 'string', enum: ['agent', 'real_estate']},
                rateable_id: {type: 'integer'},
                rating: {type: 'number', minimum: 1, maximum: 5},
                comment: {type: 'string', minLength: 2},
                created_at: {type: 'string', minLength: 2},
                updated_at: {type: 'string', minLength: 2},
            },
        };
    }

    $beforeInsert()
    {
        this.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        this.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    $beforeUpdate()
    {
        this.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    static get relationMappings()
    {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join: {
                    from: 'rateable.user_id',
                    to: 'users.id',
                },
            },
        };
    }
}

module.exports = Rateable;
