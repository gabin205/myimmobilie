'use strict';

const Model = require('objection').Model;

class Real_Estate
    extends Model
{
    static get modelPaths()
    {
        return [__dirname];
    }

    static get tableName()
    {
        return 'real_estates';
    }

    static get jsonSchema()
    {
        return {
            type: 'object',
            required: ['cost'],
            properties: {
                id: {type: 'integer'},
                header: {type: 'string'},
                description: {type: 'string'},
                size: {type: 'number', minimum: 1, maximum: 999999},
                cost: {type: 'number', minimum: 1, maximum: 4294967295},
                rooms: {type: 'integer', minimum: 1, maximum: 999999},
                running_cost: {type: 'number', minimum: 1, maximum: 999999},
                isActive: {type: 'integer', minimum: 0, maximum: 1}, // might be obsolete now
                energy_efficiency: {type: 'string'},
                build_at: {type: 'string'},
                created_at: {type: 'string'},
                updated_at: {type: 'string'},
                seller_id: {type: 'integer', minimum: 0},
                owner_id: {type: 'integer', minimum: 0},
                adress_id: {type: 'integer', minimum: 0}

            }
        };
    }

    static get namedFilters()
    {
        return {
            onlyActive: (builder) => builder.where('isActive', '=', 1)
        };
    }

    static get relationMappings()
    {
        return {
            equipment: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + '/Real_Estate_Equipment',
                join: {
                    from: 'real_estates.id',
                    through: {
                        from: 'real_estate_equipments.real_estate_id',
                        to: 'real_estate_equipments.real_estate_equipment_id'
                    },
                    to: 'real_estate_equipment.id'
                }
            },
            advertisements: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/Real_Estate_Advertisement',
                join: {
                    from: 'real_estates.id',
                    to: 'real_estate_advertisements.real_estate_id'
                }
            },
            medias: { // stored medias for this real estate
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/Real_Estate_Media',
                join: {
                    from: 'real_estates.id',
                    to: 'real_estate_medias.estate_id'
                }
            },
            adress: {
                relation: Model.HasOneRelation,
                modelClass: __dirname + '/Adress',
                join: {
                    from: 'real_estates.adress_id',
                    to: 'adresses.id'
                }
            },
            seller: { //agent
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join: {
                    from: 'real_estates.seller_id',
                    to: 'users.id'
                }
            },
            owner: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join: {
                    from: 'real_estates.owner_id',
                    to: 'users.id'
                }
            },
            favorites: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + '/User',
                filter: {favorable_type: 'realty'},
                join: {
                    from: 'real_estates.id',
                    through: {
                        from: 'favorable.favorable_id',
                        to: 'favorable.user_id'
                    },
                    to: 'users.id'
                }
            },
            ratings: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/Rateable',
                filter: {rateable_type: 'realty'},
                join: {
                    from: 'real_estates.id',
                    to: 'rateable.rateable_id'
                }
            }
        };
    }
}

module.exports = Real_Estate;
