/* eslint-disable no-magic-numbers */
import assert from 'assert/strict';
import { Feature, MultiPolygon, Point, Polygon } from 'geojson';
import test from 'node:test';

import { FastPointInPoly } from './index.js';

const polygons = [
  {
    type: 'Feature',
    properties: {
      group: 'A'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [27.457237243652344, 2.8427469926498508],
          [27.47526168823242, 2.8292023527861603],
          [27.49225616455078, 2.837946378950034],
          [27.485218048095703, 2.85646292162272],
          [27.46805191040039, 2.8590346400900875],
          [27.457237243652344, 2.8427469926498508]
        ]
      ]
    }
  },
  {
    type: 'Feature',
    properties: {
      group: 'B'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [27.49225616455078, 2.837946378950034],
          [27.496376037597656, 2.821144074199437],
          [27.503414154052734, 2.8463474398193367],
          [27.49225616455078, 2.837946378950034]
        ]
      ]
    }
  },
  {
    type: 'Feature',
    properties: {
      group: 'C'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [27.446250915527344, 2.865549634395124],
          [27.448139190673828, 2.8158290088103004],
          [27.509765625, 2.8168577330377342],
          [27.510967254638672, 2.867606993317963],
          [27.446250915527344, 2.865549634395124]
        ]
      ]
    }
  }
] satisfies Feature<Polygon | MultiPolygon>[];

const points = [
  {
    type: 'Feature',
    properties: {
      group: 'A'
    },
    geometry: {
      type: 'Point',
      coordinates: [27.47749328613281, 2.8444614927040077]
    }
  },
  {
    type: 'Feature',
    properties: {
      group: 'B'
    },
    geometry: {
      type: 'Point',
      coordinates: [27.49225616455078, 2.837946378950034]
    }
  },
  {
    type: 'Feature',
    properties: {
      group: 'B'
    },
    geometry: {
      type: 'Point',
      coordinates: [27.496376037597656, 2.8254303995594823]
    }
  },
  {
    type: 'Feature',
    properties: {
      'marker-color': '#7e7e7e',
      'marker-size': 'medium',
      'marker-symbol': '',
      group: 'C'
    },
    geometry: {
      type: 'Point',
      coordinates: [27.450199127197266, 2.8189151787658875]
    }
  },
  {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [27.50839233398437, 2.876007837152766]
    }
  }
] satisfies Feature<Point>[];

await test('points connect to the expected polys', () => {
  const finder = new FastPointInPoly(polygons);
  for (const point of points) {
    const poly = finder.find(point);
    const pointG = point.properties.group ?? null;
    const polyG = poly === null ? null : poly.properties.group;
    assert.equal(polyG, pointG);
  }
});
