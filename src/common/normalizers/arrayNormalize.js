import {normalize, schema} from 'normalizr';

const entity = new schema.Entity('data');

const entityList = [ entity ];

export default function (data) {
    return normalize(data, entityList)
}
