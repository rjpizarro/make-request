import {normalize, schema} from 'normalizr';
import _ from 'lodash';

const entity = new schema.Entity('data', {}, {
    idAttribute: '_id',
    processStrategy: (entity) => ({
        id: entity._id,
        ..._.omit(entity, '_id')
    })
});

const entityList = [ entity ];

export default function (data) {
    return normalize(data, entityList)
}
