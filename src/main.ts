import circleToPolygon from 'circle-to-polygon';
import { polygonToCells } from 'h3-js';

import { db } from './db';

import { calcExecuteTime } from './helpers/stopwatch';
import { calculateLatLngFilter } from './helpers/geo';
import { generateItems } from './helpers/generator';

const { VITE_APP_QUERY_LAT, VITE_APP_QUERY_LNG } = import.meta.env;

const BULK_ADD_COUNT = 10000 as const;
const QUERY_RADIUS = 20000 as const;

async function bulkAdd() {
  const items = generateItems(BULK_ADD_COUNT);
  await calcExecuteTime('bulkAdd', db.items.bulkAdd(items));

  console.log(`Added ${BULK_ADD_COUNT} items.`);
}

async function query() {
  // We just use below filter to calculate the radius
  // as `circleToPolygon()` doesn't expose it for us.
  const filter = calculateLatLngFilter(
    Number(VITE_APP_QUERY_LAT),
    Number(VITE_APP_QUERY_LNG),
    QUERY_RADIUS
  );

  const polygon = circleToPolygon(
    [Number(VITE_APP_QUERY_LAT), Number(VITE_APP_QUERY_LNG)],
    QUERY_RADIUS
  );

  const cells = polygonToCells(polygon.coordinates, 10);

  const query = db.items
    .where('cell')
    .anyOf(cells)
    .and((item) => {
      // This pretty much acts as a `.filter()` A typical SQL database has the same limitation
      // but it has some intelligent strategies (query plan). Dexie doesn't have that.
      return (
        item.lat > filter.lat.gt &&
        item.lat < filter.lat.lt &&
        item.lng > filter.lng.gt &&
        item.lng < filter.lng.lt
      );
    })
    .toArray();

  const items = await calcExecuteTime('query', query);

  console.log(`Found ${items.length} items. Preview:`, items.splice(0, 3));
}

await bulkAdd();
await query();
