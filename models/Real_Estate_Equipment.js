'use strict';

const Model = require('objection').Model;

class Real_Estate_Equipment
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'real_estate_equipment';
    }

    static get jsonSchema()
    {
        return {
            type      : 'object',
            required  : ['header', 'cost'],
            properties: {
                id            : {type: 'integer'},
                equipment_type: {type: 'string', enum: ['equipment', 'parking', 'floor', 'heating', 'object_type']},
                equipment_name: {type: 'string'},
            }
        }
    }

    static get relationMappings()
    {
        return {
            equipment: {
                relation  : Model.ManyToManyRelation,
                modelClass: __dirname + '/Real_Estate',
                join      : {
                    from   : 'real_estate_equipment.id',
                    through: {
                        from: 'real_estate_equipments.real_estate_equipment_id',
                        to  : 'real_estate_equipments.real_estate_id'
                    },
                    to     : 'real_estates.id'
                }
            },
        }
    }
}

module.exports = Real_Estate_Equipment;
