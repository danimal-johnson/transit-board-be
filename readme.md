# Transit Departure Board Backend <!-- omit in toc -->

[API Specification](./docs/endpoints.md)

[Jump to quick-start guide](#quick-start)

## Table of Contents

<details>

<summary>Collapsible Table of Contents</summary>

- [Table of Contents](#table-of-contents)
- [Summary](#summary)
  - [Project purpose](#project-purpose)
  - [Project scope](#project-scope)
- [Status](#status)
- [Data Sources](#data-sources)
- [Quick Start](#quick-start)
  - [Import your transit data](#import-your-transit-data)
  - [Migrate the data (optional)](#migrate-the-data-optional)
  - [Configure the server for your database](#configure-the-server-for-your-database)
  - [Install npm packages and run](#install-npm-packages-and-run)

</details>

## Summary

Create an API to serve departure times to homebrew transit boards and apps.

### Project purpose

Create an API to feed departure times to departure boards at bus stops and train platforms. While transit data is often public, it is not readily accessible by IOT devices and web frontends.

Providing an API makes it possible to:

- add a departure board anywhere with an internet connection
- create desktop and mobile apps that replicate departure board functionality
- know when you need to leave to catch the next/last bus or train

This is built for my [specific needs](./docs/motivation.md), using data from Lane Transit District (LTD) in Oregon. It publishes its data in a standard GTFS format. The format is flexible and agencies may implement it differently, but this project could serve as a starting point for other systems.

[LTD's GTFS details](./docs/gtfs_data.md)

### Project scope

1. Parse the GTFS data and extract useful information.
2. Create a SQLite database for offline applications.
3. Migrate data to a Postgres database.
4. Create an API to serve data to any device or app.
5. Create an integration utility to update database when new GTFS data is released.

## Status

- SQLite database created.
- Postgres database migration successful using `pgloader`
- Python script created to display board information in text format using SQLite.
- Defined API.
- Created express.js backend
- Created quick-start section on this page.
- Deployed!

TODO:

- [x] Find holiday schedule (from [ltd.org/hours-holiday-service](https://www.ltd.org/hours-holiday-service/))
- [x] Connect Python to Postgres database instead of sqlite. Replicate functionality.
  - [x] Try `psycopg2`. [Tutorial](https://www.postgresqltutorial.com/postgresql-python/connect/) - compatibility issues.
  - [x] Use `pgloader`. Success!
  - [x] Direct connection no longer necessary. Use sqlite for local apps.
- [x] Add quick-start instructions to this file.
- [x] Use the Jupyter notebooks to create the actual Python utilities.
- [x] Remove extraneous notes from this README file.
- [x] Deploy

## Data Sources

There is no direct public API to poll for this data, but data is published in a standardized fomat called GTFS.

- [Google Transit](https://developers.google.com/transit/gtfs)
- GTFS service on [gtfs.org](https://gtfs.org/schedule/reference/)
- Transitfeeds [LTD info](https://transitfeeds.com/p/lane-transit-district)
- Transitfeeds [LTD configuration](https://transitfeeds.com/p/lane-transit-district/314/latest)
- Transitfeeds is being replaced by [Mobility Database](https://database.mobilitydata.org/)
- [Oregon-specific site](https://oregon-gtfs.com/)
- [LTD's feed](http://feed.ltd.org/gtfs-realtime/gtfs) (zip file)
- [CSV file of links](./resources/sources.csv)

## Quick Start

### Import your transit data

Unzip your GTFS.zip data file into the `./gtfs` directory. The following steps require these 6 files and ignore all others:

1. `agency.txt`
2. `calendar_dates.txt`
3. `routes.txt`
4. `stop_times.txt`
5. `stops.txt`
6. `trips.txt`

The following Python script will parse the files and import the data into a SQLite database.

```bash
cd utils
# If you have an existing DB, back it up by renaming it
mv my_data.db my_data.old.db
# Create the new DB
./gtfs2db.py
```

### Migrate the data (optional)

If you are plan to use SQLite as your database of choice, you can skip this step.

You have many options from this point, depending on which database server you will be using.

For Postgres, here are the instructions for the [pgloader](https://pgloader.io/) utility:

Install `pgloader`

```bash
sudo apt-get update && sudo apt-get install pgloader
```

Run it.

```bash
cd utils
pgloader ./my_data.db postgresql://pguser:pgpass@pgserver/dbname

# Example for a local installation
pgloader ./my_data.db postgresql://postgres:pgpass@localhost/ltd
```

### Configure the server for your database

Create a file called `.env` in the root of this project folder and add connection details for your database. Example:

```text
PORT="3000"        // API port when not specified by the environment
USE_HTTPS="false"  // For local development  TODO: Is this necessary?

# Postgres example
PG_HOSTNAME = "127.0.0.1"
PG_PORT = 5432
PG_USER = "my_pg_username"
PG_PASSWORD = "my_pg_password"
PG_DATABASE_NAME = "my_db_name"
```

Make sure there is a `.env` line in your `.gitignore` file.

If you are not using a Postgres database, modify the `knexfile.js` file in the root directory for your situation. See [the documentation](https://knexjs.org/guide/) for details.

### Install npm packages and run

```bash
npm i
npm run start
```

**Done!** You should be able to access the API from your local machine (ex: `http://localhost:port/api/routes`)

Test a release build:

```bash
npm run build
npm run start
```
