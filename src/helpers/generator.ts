import { v4 as uuid } from 'uuid';
import { randPosition } from './geo';
import { latLngToCell } from 'h3-js';

export const generateItem = () => {
  const { lat, lng } = randPosition();

  const cell = latLngToCell(lat, lng, 10);

  return {
    id: uuid(),
    cell,
    ...randPosition(),
  };
};

export function generateItems(amount: number) {
  return new Array(amount).fill(null).map(() => generateItem());
}
