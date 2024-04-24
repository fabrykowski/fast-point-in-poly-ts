import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Point,
  Polygon
} from 'geojson';
import centerOfMass from '@turf/center-of-mass';
import KDBush from 'kdbush';
import { around } from 'geokdbush-tk';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

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

    const points = this.#features.map(f => centerOfMass(f));

    this.#index = new KDBush(points.length);

    for (const point of points) {
      this.#index.add(
        point.geometry.coordinates[0],
        point.geometry.coordinates[1]
      );
    }
  }

  find(
    point: Feature<Point> | Point | [longitude: number, latitude: number]
  ): Feature<Polygon | MultiPolygon, Properties> | null {
    const [longitude, latitude] = Array.isArray(point)
      ? point
      : point.type === 'Feature'
        ? point.geometry.coordinates
        : point.coordinates;

    const indices = around(this.#index, longitude, latitude);

    for (let i = 0; i < indices.length; i++) {
      const feature = this.#features[indices[i]];

      if (booleanPointInPolygon(point, feature)) {
        return feature;
      }
    }

    return null;
  }
}

export default FastPointInPoly;
