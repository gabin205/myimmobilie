'use strict';

const Model = require('objection').Model;

class Conversation
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'message_conversations';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            properties: {
                id        : {type: 'integer'},
                msg_id    : {type: 'integer'},
                created_at: {type: 'string', minLength: 2},
                updated_at: {type: 'string', minLength: 2},
            }
        }
    }

    $beforeInsert()
    {
        this.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    $beforeUpdate()
    {
        this.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    static get relationMappings()
    {
        return {
            message     : {
                relation  : Model.BelongsToOneRelation,
                modelClass: __dirname + '/Message',
                join      : {
                    from: 'message_conversations.msg_id',
                    to  : 'messages.id'
                }
            },
            participants: {
                relation  : Model.ManyToManyRelation,
                modelClass: __dirname + '/User',
                join      : {
                    from   : 'message_conversations.id',
                    through: {
                        from: 'message_conversation_participants.conversation_id',
                        to  : 'message_conversation_participants.user_id'
                    },
                    to     : 'users.id'
                }
            },
        }
    }
}

module.exports = Conversation;
