import {normalize, schema} from 'normalizr';
import _omit from 'lodash/omit';

const entity = new schema.Entity('data', {}, {
    idAttribute: '_id',
    processStrategy: (entity) => ({
        id: entity._id,
        ..._omit(entity, '_id')
    })
});

const entityList = [ entity ];

export default function (data) {
    return normalize(data, entityList)
}
