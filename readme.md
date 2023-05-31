# LTD Countdown Timer Project

The purpose of this project is to create a subway-station-like billboard at my house that counts down the number of minutes until the next bus departs.

Reason: the current LTD website takes too long to navigate to find the information, particularly on a phone (enter URL, choose "maps", select route, change to non-default direction, tap on scrollable table to see times, scroll horizontally to find correct stop, then realize it's Sunday evening and you've been viewing AM times on the Weekday tab)

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

## GTFS data format

**G**eneral **T**ransit **F**eed **S**pecification

GTFS data is stored in a series of text files in CSV format.

Possible files are *stops.txt*, *routes.txt*. *trips.txt*, *shapes.txt*, calendar.txt, *calendar_dates.txt*, *stop_times.txt*, frequencies.txt, *agency.txt*, attributions.txt, feed_info.txt, *fare_attributes.txt*, fare_rules.txt, levels.txt, pathways.txt, translations.txt, transfers.txt

ArcGIS Pro can help create the map

Files in *italics* are published by LTD. The first 8 are most relevant.

## Drilling into LTD's data

From `stops.csv`

- Springfield Station IDs: 02501-02507 (Bays A-G). 02510 = Special event.
- Eugene Station IDs: 02101-02121 (Bays A-U)
- Springfield Station Bay G is Station ID #02507 (LTD -> Eugene)
- Eugene Station Bay U is ID #02121 (LTD -> Springfield)

From `stop_times.txt`

- The EmX route number between Springfield and Eugene is 101. It appears to be a subset of route 103.
- The file `stop_times.txt` is too large for VSCode (12.7MB), so `stop_times_2.csv` (874k) is an abbreviated version that only contains the billboard "101 EmX EUGENE STATION"

`stop_times_3.csv` (39k) further reduces this to stop 02507

- The 2nd field is arrival time, the 3rd field is departure time. We're interested in departure time.
- The stop # is usually 16 or 28, depending on the route. (This is might be good to know for error checking.)

Note: Schedule on the website has Route 103 listed in the URL [ltd.org/system-map/route_103](https://ltd.org/system-map/route_103/), but that includes the whole route between Gateway Station and Commerce Station

TODO:

- Sort `stop_times_3.csv` to list all times
- Find the pattern that differentiates weekdays/Saturdays/Sundays
- Compare against [LTD Website](https://www.ltd.org/system-map/route_103/)
- Import data into database
  - hint 1: [SQLite option from mungingdata](https://mungingdata.com/sqlite/create-database-load-csv-python/)
  - hint 2: Use pandas in Python
- Find holiday schedule (from [ltd.org/hours-holiday-service](https://www.ltd.org/hours-holiday-service/))
  - MLK (M Jan 16): M-F
  - Presidents (M Jan 16): M-F
  - Memorial (M May 29): Sun*
  - Juneteenth (M Jun 19): M-F
  - Independence (T Jul 4): Sun*
  - Labor (M Sep 4): Sun*
  - Indigenous (M Oct 9): M-F
  - Veterans (Sa, Nov 11): Sat (normal)
  - Thanksgiving (Th, Nov 23): No service!
  - Day after (F, Nov 24): M-F
  - Christmas eve (Su, Dec 24): Sun, but ends at 7:30!
  - Christmas day (M, Dec 25): No service!
  - New years (M, Jan 1, 2024): Sun*
