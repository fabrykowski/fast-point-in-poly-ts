import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import centerOfMass from '@turf/center-of-mass';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Point,
  Polygon
} from 'geojson';
import { around } from 'geokdbush';
import KDBush from 'kdbush';

// noinspection JSUnusedGlobalSymbols
export class FastPointInPoly<
  Properties extends GeoJsonProperties = GeoJsonProperties
> {
  readonly #features: Feature<Polygon | MultiPolygon, Properties>[];
  readonly #index: KDBush;

  constructor(
    features:
      | FeatureCollection<Polygon | MultiPolygon, Properties>
      | Feature<Polygon | MultiPolygon, Properties>[]
  ) {
    if (Array.isArray(features)) {
      this.#features = features;
    } else {
      this.#features = features.features;
    }

    const points = this.#features.map(feature => centerOfMass(feature));

    this.#index = new KDBush(points.length);

    for (const point of points) {
      const [longitude, latitude] = point.geometry.coordinates;
      this.#index.add(longitude, latitude);
    }
  }

  find(
    point: Feature<Point> | Point | [longitude: number, latitude: number]
  ): Feature<Polygon | MultiPolygon, Properties> | null {
    const [longitude, latitude] = getLongitudeAndLatitude(point);

    const indices = around(this.#index, longitude, latitude);

    for (const index of indices) {
      const feature = this.#features[index];

      if (booleanPointInPolygon(point, feature)) {
        return feature;
      }
    }

    return null;
  }
}

type Position2D = [longitude: number, latitude: number];
const DIMENSIONS = 2;

const getLongitudeAndLatitude = (
  point: Feature<Point> | Point | [longitude: number, latitude: number]
): Position2D => {
  if (Array.isArray(point)) {
    return point;
  }

  if (point.type === 'Feature') {
    return point.geometry.coordinates.slice(0, DIMENSIONS) as Position2D;
  }

  return point.coordinates.slice(0, DIMENSIONS) as Position2D;
};

export default FastPointInPoly;
