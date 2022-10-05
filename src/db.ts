import Dexie, { type Table } from 'dexie';

export interface Item {
  cell: string;
  lat: number;
  lng: number;
}

export class DexieDB extends Dexie {
  // 'items' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case.
  items!: Table<Item>;

  constructor() {
    super('our-awesome-app');

    this.version(1).stores({
      items: '&id, cell, [lat+lng]', // Primary key and indexed props
    });
  }
}

export const db = new DexieDB();

db.open()
  .then(async () => {
    console.log('[IndexedDB] Database opened succesfully!');

    const rowCount = await db.items.count();
    console.log(`Count of items already in DB: ${rowCount}`);
  })
  .catch((err) => {
    console.error(err);
  });

db.on('close', () => {
  console.log('[IndexedDB] Database has been closed.');
});

db.on('blocked', () => {
  console.log('[IndexedDB] Database has been blocked.');
});

db.on('versionchange', () => {
  console.log('[IndexedDB] Database version has been changed.');
});
