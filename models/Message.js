'use strict';

const Model = require('objection').Model;

class Message
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'messages';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            properties: {
                id             : {type: 'integer'},
                type           : {type: 'string', enum: ['message', 'agent_contact', 'appointment']},
                sender_id      : {type: 'integer'},
                receiver_id    : {type: 'integer'},
                parent_id      : {type: ['integer','null']},
                header         : {type: 'string', minLength: 2, maxLength: 50},
                body           : {type: 'string', minLength: 2},
                created_at     : {type: 'string', minLength: 2},
                updated_at     : {type: 'string', minLength: 2},
                sent_at        : {type: 'string', minLength: 2},
                received_at    : {type: 'string', minLength: 2},
                real_estate_id : {type: 'integer'}
            }
        }
    }

    $afterGet()
    {
        this.received_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    $beforeInsert()
    {
        this.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        this.sent_at    = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    $beforeUpdate()
    {
        this.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    static get relationMappings()
    {
        return {
            parent  : {
                relation  : Model.BelongsToOneRelation,
                modelClass: __dirname + '/Message',
                join      : {
                    from: 'messages.parent_id',
                    to  : 'messages.id'
                }
            },
            answers : {
                relation  : Model.HasManyRelation,
                modelClass: __dirname + '/Message',
                join      : {
                    from: 'messages.id',
                    to  : 'messages.parent_id'
                }
            },
            sender  : {
                relation  : Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join      : {
                    from: 'messages.sender_id',
                    to  : 'users.id'
                }
            },
            receiver: {
                relation  : Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join      : {
                    from: 'messages.receiver_id',
                    to  : 'users.id'
                }
            },
            real_estate: {
                relation  : Model.BelongsToOneRelation,
                modelClass: __dirname + '/Real_Estate',
                join      : {
                    from: 'messages.real_estate_id',
                    to  : 'real_estates.id'
                }
            }
        }
    }
}

module.exports = Message;
