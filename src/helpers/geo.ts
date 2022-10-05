import { rand } from './rand';

const {
  VITE_APP_RAND_LAT_MIN,
  VITE_APP_RAND_LNG_MIN,
  VITE_APP_RAND_LAT_MAX,
  VITE_APP_RAND_LNG_MAX,
} = import.meta.env;

export function calculateLatLngFilter(
  lat: number,
  lng: number,
  radius: number
) {
  const pi = 3.14;
  const R = 6371e3;

  const minLat = +lat - ((radius / R) * 180) / pi;
  const maxLat = +lat + ((radius / R) * 180) / pi;
  const minLng = +lng - ((radius / R) * 180) / pi / Math.cos((+lat * pi) / 180);
  const maxLng = +lng + ((radius / R) * 180) / pi / Math.cos((+lat * pi) / 180);

  return {
    lat: {
      gt: minLat,
      lt: maxLat,
    },
    lng: {
      gt: minLng,
      lt: maxLng,
    },
  };
}

export function randPosition() {
  return {
    lat: rand(VITE_APP_RAND_LAT_MIN, VITE_APP_RAND_LAT_MAX),
    lng: rand(VITE_APP_RAND_LNG_MIN, VITE_APP_RAND_LNG_MAX),
  };
}
