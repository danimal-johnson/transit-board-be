# Transit Departure Board Project - Backend <!-- omit in toc -->

## Table of Contents

<details>

<summary>Collapsible Table of Contents</summary>

- [Table of Contents](#table-of-contents)
- [Summary](#summary)
  - [Project scope](#project-scope)
  - [Justification](#justification)
- [Status](#status)
- [Use Cases](#use-cases)
  - [Leaving the house](#leaving-the-house)
  - [Heading home](#heading-home)
- [Data Sources](#data-sources)
  - [GTFS data format](#gtfs-data-format)
  - [Drilling into LTD's data](#drilling-into-ltds-data)

</details>

## Summary

The purpose of this project is to replicate the features of a transit departure board so it can be viewed from any location. A departure board shows the next departing buses or trains from a specific bus stop or rail platform.

This is built for my specific needs, using data from Lane Transit District (LTD) in Oregon. Like most transit, LTD posts its data in the standard GTFS format (details below), but does not provide any API that can be directly polled for this information.

### Project scope

1. Parse the GTFS data and extract useful information.
2. Create a SQLite database for offline applications.
3. Migrate data to a Postgres database.
4. Create an API to serve data to any device or app.
5. Create an integration utility to update database when new GTFS data is released.

### Justification

1. The county transit website (LTD) is helpful for finding the best route to a new location, but too cumbersome to navigate for regularly-traveled routes (like your daily commute).
2. The current transit app (Umu) is a bit better at checking times, but not nearly as convenient as a quick glance.
3. The paper or PDF version of the printed schedule is even harder to manage. Time tables fill multiple pages. PM times are only differentiated by a slightly-bolder typeface - really hard to discern when flipping pages. It's easy to look up AM when you mean PM, etc.
4. A functional bus billboard would be really cool to have at my house!

## Status

- SQLite database created.
- Python script created to display board information in text format using SQLite.
- Postgres database migration successful using `pgloader`
- Imported data into sqlite database and created migration step to convert to Postgres.
- Current step: Defining API.
- Next step: Create express.js backend.

TODO:

- [x] Sort `stop_times_3.csv` to list all times
- [x] Find the pattern that differentiates weekdays/Saturdays/Sundays
- [x] Compare against [LTD Website](https://www.ltd.org/system-map/route_103/)
- Import data into database
  - [x] hint 1: [SQLite option from mungingdata](https://mungingdata.com/sqlite/create-database-load-csv-python/)
  - [x] hint 2: Use pandas in Python
- [x] Find holiday schedule (from [ltd.org/hours-holiday-service](https://www.ltd.org/hours-holiday-service/))
  
- [x] Connect Python to Postgres database instead of sqlite. Replicate functionality.
  - [x] Try `psycopg2`. [Tutorial](https://www.postgresqltutorial.com/postgresql-python/connect/) - compatibility issues.
  - [x] Use `pgloader`. Success!
  - [x] Direct connection no longer necessary. Use sqlite for local apps.
- [ ] Create SQL queries for most useful lookups
- [ ] Adjust table creation to make lookups more efficient.
- [ ] Use the Jupyter notebooks to create the actual Python utilities.
- [ ] Choose between REST and GraphQL
- [ ] Create the API
- [ ] Host API on railway

## Use Cases

### Leaving the house

- My house is a 15-minute walk or 4-minute bike ride to the bus station.
- Buses are spaced 15-30 minutes apart. Missing the last one can be disastrous.
- Looking through the printed schedule or navigating the website takes too long.
- I want to know when I should leave to catch the next bus on time.
- (Do I need to rush out the door in a full panic? Do I have time to go back and grab the thing I forgot? If I miss it, can I take the next bus and still be OK?)
- I would like a physical display, web app, or widget to tell me the next times quickly.

### Heading home

- Buses service is 30 minutes apart. The last bus leaves at different times on weekdays, Saturdays, Sundays, and holidays. It's easy to lose track.
- I would like to look at an app on my phone to see a billboard-like display of minutes until the next departure, time of the next departures, and time of the last departure of the day.

Stretch goal: create an API that works for other stations

## Data Sources

There is no direct public API to poll for this data, but data is published in a standardized fomat called GTFS.

- [Google Transit](https://developers.google.com/transit/gtfs)
- GTFS service on [gtfs.org](https://gtfs.org/schedule/reference/)
- Transitfeeds [LTD info](https://transitfeeds.com/p/lane-transit-district)
- Transitfeeds [LTD configuration](https://transitfeeds.com/p/lane-transit-district/314/latest)
- Transitfeeds is being replaced by [Mobility Database](https://database.mobilitydata.org/)
- [Oregon-specific site](https://oregon-gtfs.com/)
- [LTD's feed](http://feed.ltd.org/gtfs-realtime/gtfs) (Zip-file)

### GTFS data format

**G**eneral **T**ransit **F**eed **S**pecification

GTFS data is stored in a series of text files in CSV format. Some are required, while others are optional.

Possible files are *stops.txt*, *routes.txt*. *trips.txt*, *shapes.txt*, calendar.txt, *calendar_dates.txt*, *stop_times.txt*, frequencies.txt, *agency.txt*, attributions.txt, feed_info.txt, *fare_attributes.txt*, fare_rules.txt, levels.txt, pathways.txt, translations.txt, transfers.txt

ArcGIS Pro can help create the map.

The first 8 files are most relevant. Files in *italics* are published by LTD. 

### Drilling into LTD's data

From `routes.txt`

- The shortest file, with only 28 entries.
- "agency_id": Always "LTD".
- "route_id": This should be the key field. Other tables reference it.
- "route_short_name": This is the route number that should be displayed to the user. It is the same as "route_id" in every case except EmX (route 103)
- "route_long_name": Useful for looking up a route or displaying to user. Keep.
- "route_desc": Not used. Drop.
- "route_type": Always 3 (bus). Drop.

Summary:

- Only keep route_id (key), route_short_name, route_long_name.

From `stops.txt`

- All individual stops and bays have a 5-digit stop_id, indexed from 00001-09973. There are big gaps (ex: 3000-9000) 1170 stops total.
- There are 11 multi-bay stations, numbered 99901-99911.
- If a stop is in a station, the station ID will be listed under "parent_station and the "platform_code" will contain the bay letter.
- The field "stop_name" is useful and should be kept.
- The fields "stop_lat" and "stop_lon" could be useful in future app versions for a "find my route from this stop" feature. Drop for now.
- "stop_code" duplicates the stop ID, and the rest of the fields are blank. Safe to drop.

Summary:

- Keep stop_id (key), stop_name, parent_station, platform_code

For reference:

- Springfield Station IDs: 02501-02507 (Bays A-G). 02510 = Special event.
- There are 7 different arrival zones listed. They have non-numerical stop IDs (ex: arr_lcc, escenter, arr_uo)
- Eugene Station IDs: 02101-02121 (Bays A-U)
- Springfield Station Bay G is Station ID #02507 (EmX -> Eugene)
- Eugene Station Bay U is ID #02121 (EmX -> Springfield)

From `calendar_dates.txt`

- "service_id": the schedule(s) in use that day. 8 digit-numbers.
- "date": yyyymmdd format.
- Note: Multiple schedules may be in use the same day. We must query all service IDs, where date = yyyymmdd for filtering our trip lookups (below)
- "exception_type": 1 means added. 0 means removed. Always 1. Drop.
- Since this table forms a many-to-many relationship, the primary key should be auto-created.
- Current calendar file ends on June 17. Bus station confirms summer schedule begins on June 18.

Summary:

- keep service_id and "date"
- Add an auto-increment key

At this point, we have all the starting information for our search:

- Our route ID
- Our stop ID
- All the schedules in use today.

From `trips.txt`

- Each "trip" is a single bus traveling along a route at a specific time of the day. It's associated with a single schedule.
- 5241 trips total
- "route_id": references route number in routes.txt
- "service_id": the "schedule" this route is listed on.
- "trip_id": the key field from this file.
- "trip_headsign": Friendly trip description. Useful.
- "block_id": Unknown. Drop.
- "direction_id": 0 or 1. Could be helpful.
- "shape_id" - references GPS data file. Drop.

Summary:

- Keep trip_id(key), route_id, service_id, trip_headsign, direction_id

From `stop_times.txt`

- trip_id: References a specific trip. Keep. Key?
- arrival_time: Not important. We only care about departure times.
- departure_time: "hh:mm:ss" format. May be blank ("")! Keep the field, but drop the stops without timepoints.
- stop_id: keep. We'll be searching by this value.
- stop_sequence: not needed unless we want to predict stop times for intermediate stops in a later version
- stop_headsign: what to display at the stop. Keep?
- Drop all remaining columns.

Summary:

- Keep trip_id (key), departure_time, stop_id, stop_headsign
- Consider joining on trip_id to add route_id and service_id [Example](https://github.com/donautech/podcasts/blob/master/1_gtfs/ouibus_data.ipynb) [Video](https://www.youtube.com/watch?v=IeardDdWcQk)

Previous info...

- The EmX route number between Springfield and Eugene is 101. It appears to be a subset of route 103.
- The file `stop_times.txt` is too large for VSCode (12.7MB), so `stop_times_2.csv` (874k) is an abbreviated version that only contains the billboard "101 EmX EUGENE STATION"

`stop_times_3.csv` (39k) further reduces this to stop 02507

- The 2nd field is arrival time, the 3rd field is departure time. We're interested in departure time.
- The stop # is usually 16 or 28, depending on the route. (This is might be good to know for error checking.)

Note: Schedule on the website has Route 103 listed in the URL [ltd.org/system-map/route_103](https://ltd.org/system-map/route_103/), but that includes the whole route between Gateway Station and Commerce Station

