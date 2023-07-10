# API Specification

[Back to readme document](../readme.md)

## GET requests

Note: *All* endpoints are of type `GET`. The database is treated as read-only through this public-facing API.

### General

#### `GET /`

Root directory. Returns static page with usage information.

#### `GET /api`

Root directory of the API. Static page provided as a catch-all

#### `GET /api/info`

Returns meta information about the database. Expect a single JSON object with the following fields:

```js
{
  agency_id,   // Agency short-name ex: "LTD"
  name,        // Agency full name
  url,         // URL of transit agency
  timezone,    // Timezone published by the agency
  language,    // Agency's language. ex: "EN"
  start_date,  // First calendar date of current schedule
  end_date,    // Last calendar date of current schedule
  utc_time,    // Current UTC time
  server_time, // Time in the server's timezone.
  local_time   // Time in the agency's timezone.
}
```

- `timezone` example: "America/Los_Angeles"
- `start_date` and `end_date` are in the form "YYYYMMDD"
- ~~`utc_time` is in the format "YYYY-MM-DDTHH:MM:SS.mmmZ"~~
- `utc_time` format may vary depending on the server's implementation
- `server_time` and `local_time` format may depend on user's locale

### Routes

#### `GET /api/routes/:id`

Returns information for a specific route

```js
{
  index,            // Ignore. Not used.
  route_id,         // Ex: "01", "103", "13"
  route_short_name, // Ex: "01", "EmX", "13"
  route_long_name   // Ex: "Campbell Center", "EmX", "Centennial"
}
```

#### `GET /api/routes`

Returns an array of all routes in the system (same fields as above)

```js
[{ index, route_id, route_short_name, route_long_name }, ]
```

### Stops

Information about a specific stop by ID.

#### `GET /api/stops/:id`

```js
{
  index,          // Ignore. Not used.
  stop_id,        // Ex: "02507"
  stop_name,      // Ex: "Springfield Station, Bay G"
  stop_lat,       // Ex: "44.0455"
  stop_lon,       // Ex: "-123.022"
  parent_station, // Ex: "" or "99902"
  platform_code,  // Ex: "" or "G"
}
```

If a stop is a bay of a larger station, its parent station will be set to the ID of the parent station and the platform code will be set to the platform letter. Otherwise, both fields are empty.

Parent stations are also searchable using the same endpoint.

#### `GET /api/stops?`

- By route: `/api/stops?route=01`
- By station: `/api/stops?station=99901`

Returns an array of all stop IDs and stop names by route or by station ID. Useful for setting up a new departure board.

```js
[{ stop_id, stop_name }, ]
```

### Departures

#### `GET /api/departures?`

- Required: `?stop=[id]`
- Required: `&date=[YYYYMMDD]` or `&date=today`
- Optional: `&route=[id]` - limits results to a single route

Returns a list of all departure times from a given stop on a given date, along with the associated headsigns.

```js
[{
  departure_time,  // ex: "16:12:00"
  stop_headsign,   // ex: "101 EmX EUGENE STATION"
  trip_headsign,   // ex: "103 EmX WEST 11TH <> COMMERCE STATION"
}]
```

### Stations

A station is just "stop" that contains other stops (bays, tracks, gates, etc).

#### `GET /api/stations`

Returns an array of all stations in the system.

```js
[{ stop_id, stop_name, stop_lat, stop_lon }, ]
```

To find a list of stops at a station, use `/api/stops?station=[id]`.
