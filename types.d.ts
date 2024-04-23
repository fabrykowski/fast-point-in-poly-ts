declare module 'geokdbush-tk' {
  import KDBush from 'kdbush';

  export function around(
    index: KDBush,
    longitude: number,
    latitude: number,
    maxResults?: number,
    maxDistance?: number,
    filterFn?: (i: number) => boolean
  ): number[];

  export function distance(
    longitude1: number,
    latitude1: number,
    longitude2: number,
    latitude2: number
  ): number;
}
