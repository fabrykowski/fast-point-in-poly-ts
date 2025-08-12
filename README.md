# fast-point-in-poly-ts

[![NPM Version](https://img.shields.io/npm/v/vite-plugin-ssh-tunnel)](https://www.npmjs.com/package/fast-point-in-poly-ts)

Simple API for doing point and polygon checks on large sets of polygons. Most useful when doing MANY checks.

This version is a TypeScript port of the original [fast-point-in-poly](https://github.com/crosscutio/fast-point-in-poly) package.

## Usage

```typescript
import FastPointInPoly from 'fast-point-in-poly-ts';

const features = getUsStates(); // get GeoJSON FeatureCollection of US states
const point = [30.835188139646572, -84.89577461462216]

const index = new FastPointInPoly(states);

const poly = index.find(point); // returns the Feature representing Georgia!
```

## Speed

This libraray's speed comes from converting the input polygons to points and putting those points in a wicked fast [KDBush](https://github.com/mourner/kdbush) index. This index allows us to use [geokdbush](https://github.com/mourner/geokdbush) to sort the polygons points by their distance from the point passed to find. With this sorted list we then do a basic [turf.booleanPointInPolygon](http://turfjs.org/docs/#booleanPointInPolygon) check and return the first polygon which passes the check. How this index works may change in the future as we build up perf tests and find more robust ways to perform this check.

## API: `class FastPointPoly`

### `constructor(features)`

Constructs an index of the provided features that can be searched.

- **features** is either a [FeatureCollection](https://datatracker.ietf.org/doc/html/rfc7946#section-3.3) or an array of [Features](https://tools.ietf.org/html/rfc7946#section-3.2).
  
  Only [Polygon](https://tools.ietf.org/html/rfc7946#section-3.1.6) and [MultiPolygon](https://tools.ietf.org/html/rfc7946#section-3.1.7) features are supported.

### `find(point)`

Returns the first feature in the index which contains the passed point.

- **point** is one of the following:
  - [Point](https://tools.ietf.org/html/rfc7946#section-3.1.2)
  - Point [Feature](https://tools.ietf.org/html/rfc7946#section-3.2)
  - Array of `[number, number]` coordinates representing the longitude and latitude of the point
