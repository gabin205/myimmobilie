'use strict';

const Model = require('objection').Model;

class User
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'users';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            required  : ['first_name', 'last_name', 'email', 'password'],
            properties: {
                id                : {type: 'integer'},
                first_name        : {type: 'string', minLength: 2, maxLength: 20},
                last_name         : {type: 'string', minLength: 2, maxLength: 20},
                email             : {type: 'string', minLength: 5, maxLength: 70},
                salt              : {type: 'string', minLength: 16, maxLength: 16},
                password          : {type: 'string', minLength: 128, maxLength: 128},
                phone             : {type: 'string', minLength: 2, maxLength: 20},
                mobile            : {type: 'string', minLength: 2, maxLength: 20},
                usePublicTransport: {type: 'integer', minimum: 0, maximum: 1},
                profilepicture    : {type: 'string'},
                adress_id         : {type: 'integer'}
            }
        }
    }

    static get relationMappings()
    {
        return {
            real_estate         : { // real estate owned by this user
                relation  : Model.HasManyRelation,
                modelClass: __dirname + '/Real_Estate',
                join      : {
                    from: 'users.id',
                    to  : 'real_estates.owner_id'
                }
            },
            selling_real_estate : { // real estate to be sold by this user
                relation  : Model.HasManyRelation,
                modelClass: __dirname + '/Real_Estate',
                join      : {
                    from: 'users.id',
                    to  : 'real_estates.seller_id'
                }
            },
            advertisements      : { // advertisements made by this agent
                relation  : Model.HasManyRelation,
                modelClass: __dirname + '/Real_Estate_Advertisement',
                join      : {
                    from: 'users.id',
                    to  : 'real_estate_advertisements.user_id',
                }
            },
            roles               : {
                relation  : Model.ManyToManyRelation,
                modelClass: __dirname + '/Role',
                join      : {
                    from   : 'users.id',
                    through: {from: 'user_roles.user_id', to: 'user_roles.role_id'},
                    to     : 'roles.id'
                }
            },
            family              : {
                relation  : Model.HasManyRelation,
                modelClass: __dirname + '/User_Families',
                join      : {
                    from: 'users.id',
                    to  : 'user_families.user_id'
                }
            },
            conversations       : {
                relation  : Model.ManyToManyRelation,
                modelClass: __dirname + '/Conversation',
                join      : {
                    from   : 'users.id',
                    through: {
                        from: 'message_conversation_participants.user_id',
                        to  : 'message_conversation_participants.conversation_id'
                    },
                    to     : 'message_conversations.id'
                }
            },
            received_messages   : {
                relation  : Model.HasManyRelation,
                modelClass: __dirname + '/Message',
                join      : {
                    from: 'users.id',
                    to  : 'messages.receiver_id'
                }
            },
            searches            : {
                relation  : Model.HasManyRelation,
                modelClass: __dirname + '/Search',
                join      : {
                    from: 'users.id',
                    to  : 'searches.user_id'
                }
            },
            adress              : {
                relation  : Model.HasOneRelation,
                modelClass: __dirname + '/Adress',
                join      : {
                    from: 'users.adress_id',
                    to  : 'adresses.id'
                }
            },
            // should work. needs testing
            favorite_real_estate: {
                relation  : Model.ManyToManyRelation,
                modelClass: __dirname + '/Real_Estate',
                filter    : {favorable_type: 'real_estate'},
                join      : {
                    from   : 'users.id',
                    through: {
                        from: 'favorable.user_id',
                        to  : 'favorable.favorable_id'
                    },
                    to     : 'real_estates.id'
                }
            },
            // all favorables connected to this user (made by this user)
            favorites           : {
                relation  : Model.HasManyRelation,
                modelClass: __dirname + '/Favorable',
                join      : {
                    from: 'users.id',
                    to  : 'favorable.user_id',
                }
            },
            // all favorables related to this agent.
            favorite_agent      : {
                relation  : Model.ManyToManyRelation,
                modelClass: __dirname + '/User',
                filter    : {favorable_type: 'agent'},
                join      : {
                    from   : 'users.id',
                    through: {
                        from: 'favorable.favorable_id',
                        to  : 'favorable.user_id'
                    },
                    to     : 'users.id'
                }
            },
            /**
             * As we got a model for the junction table I changed the Relations to 1:m to retrieve that model and it's
             * fields. If there occure errors another way would be standard n:m relations with the "extra" attribute
             * defining the columns present in the junction table
             */
            // all ratings on real_estate
            rated_real_estate   : {
                relation  : Model.HasManyRelation,
                modelClass: __dirname + '/Rateable',
                filter    : {rateable_type: 'real_estate'},
                join      : {
                    from: 'users.id',
                    to  : 'rateable.user_id'
                }
            },
            // all ratings on agents
            rated_agent         : {
                relation  : Model.HasManyRelation,
                modelClass: __dirname + '/Rateable',
                filter    : {rateable_type: 'agent'},
                join      : {
                    from: 'users.id',
                    to  : 'rateable.user_id'
                }
            },
            // all ratings related to this agent. (made by other users about this agent
            agent_ratings       : {
                relation  : Model.HasManyRelation,
                modelClass: __dirname + '/Rateable',
                filter    : {rateable_type: 'agent'},
                join      : {
                    from: 'users.id',
                    to  : 'rateable.rateable_id',
                }
            },
            // all ratings of this user
            user_ratings        : {
                relation  : Model.HasManyRelation,
                modelClass: __dirname + '/Rateable',
                join      : {
                    from: 'users.id',
                    to  : 'rateable.user_id'
                }
            },
            //ADDED FROM TIM
            agency              : {
                relation  : Model.HasOneThroughRelation,
                modelClass: __dirname + '/Real_Estate_Agency',
                join      : {
                    from   : 'users.id',
                    through: {
                        from: 'user_roles.user_id',
                        to  : 'user_roles.agency_id'
                    },
                    to     : 'real_estate_agencies.id'
                }
            },
        }
    }
}

module.exports = User;
