# Database Queries

## All requests

### Routes

- index: bigint
- route_id: text
- route_short_name: text
- route_long_name: text

Get all routes

```sql
-- Either:
SELECT * FROM routes;
-- Or:
SELECT route_id, route_short_name, route_long_name
FROM routes;
```

### Stops

- index: bigint
- stop_id: text
- stop_name: text
- stop_lat: real
- stop_lon: real
- parent_station: real
- platform_code: text

Get a single stop's details

```sql
  SELECT * FROM stops WHERE stop_id='02507';
```

Get parent stations

```sql
SELECT DISTINCT parent_station
FROM stops
WHERE parent_station IS NOT null;
```

All stops that have parent stations

```sql
-- Some of these don't have bays
SELECT * FROM stops
WHERE parent_station IS NOT null;
-- These all do
SELECT * FROM stops
WHERE platform_code IS NOT null;
```

Searching for a stop name with wildcards

```sql
SELECT * FROM stops
WHERE platform_code IS NOT null
AND stop_name LIKE 'Springfield Station%';
```

Get stop IDs on a route (the table layout seems inefficient for this)

```sql
SELECT DISTINCT stop_id FROM stop_times
WHERE trip_id IN (SELECT trip_id FROM trips WHERE route_id = '91');
```

Get stop IDs *and names* on a route

```sql
SELECT DISTINCT stop_times.stop_id, stops.stop_name
FROM stop_times
INNER JOIN stops ON stop_times.stop_id=stops.stop_id
WHERE trip_id IN (SELECT trip_id FROM trips WHERE route_id = '91');
```


### Calendar Dates

- index: bigint
- serviceId: bigint
- date: bigint

Get list of schedules for a date

```sql
SELECT service_id FROM dates
WHERE date = 20230605;
```

Get start of calendar

```sql
SELECT date FROM dates
ORDER BY date LIMIT 1;
```

Get end of calendar

```sql
SELECT date FROM dates
ORDER BY date DESC LIMIT 1;
```

### Departure times

Get departure times for a stop and date with headsigns

```sql
SELECT departure_time, stop_headsign, trip_headsign FROM stop_times
WHERE stop_id='02501' AND
service_id IN (SELECT service_id FROM dates WHERE date=20230605)
ORDER BY departure_time;
```
