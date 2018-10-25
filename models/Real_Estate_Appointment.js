'use strict';

const Model = require('objection').Model;

class Real_Estate_Appointment
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'real_estate_appointments';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            required  : [],
            properties: {
                id            : {type: 'integer'},
                real_estate_id: {type: 'integer', minimum: 0},
                agent_id      : {type: 'integer', minimum: 0},
                user_id       : {type: 'integer', minimum: 0},
                appointment   : {type: 'string', minLength: 2},
                created_at    : {type: 'string', minLength: 2},
                updated_at    : {type: 'string', minLength: 2}
            }
        };
    }
    
    $afterGet()
    {
        //this.appointment = new Date().toISOString().slice(0, 19).replace('T', ' ');
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
            realty: {
                relation  : Model.BelongsToOneRelation,
                modelClass: __dirname + '/Real_Estate',
                join      : {
                    from: 'real_estate_appointments.real_estate_id',
                    to  : 'real_estates.id'
                }
            },
            agent: {
                relation  : Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join      : {
                    from: 'real_estate_appointments.agent_id',
                    to  : 'users.id'
                }
            },
            user: {
                relation  : Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join      : {
                    from: 'real_estate_appointments.user_id',
                    to  : 'users.id'
                }
            }
        };
    }
};

module.exports = Real_Estate_Appointment;
