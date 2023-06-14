#!/usr/bin/env python3

import pandas as pd
import sqlite3
from pathlib import Path

source_dir = '../gtfs/'
sqlite_file = './my_data.db'

# -------------- Connect to SQLite DB ---------------

# Create a new SQLite database if it doesn't exist
Path(sqlite_file).touch()
try:
  # Connect to it
  conn = sqlite3.connect('my_data.db')
  c = conn.cursor()
except sqlite3.Error as e:
  print(e)

# ------------------ Load GTFS data ------------------

# Load gtfs data in Pandas dataframes
# catch exceptions if files are missing
try:
  agency_df = pd.read_csv(f'{source_dir}agency.txt')
  routes_df = pd.read_csv(f'{source_dir}routes.txt')
  stops_df = pd.read_csv(f'{source_dir}stops.txt')
  calendar_dates_df = pd.read_csv(f'{source_dir}calendar_dates.txt')
  trips_df = pd.read_csv(f'{source_dir}trips.txt')
  stop_times_df = pd.read_csv(f'{source_dir}stop_times.txt')
except FileNotFoundError:
  print('Missing GTFS data files. Please unzip the GTFS data into the gtfs folder.')
  print('Required: agency, routes, stops, calendar_dates, trips, and stop_times .txt files.')
  exit()

# Trim unnecessary columns
routes_df = routes_df[['route_id', 'route_short_name', 'route_long_name']]
stops_df = stops_df[['stop_id', 'stop_name', 'stop_lat', 'stop_lon', 'parent_station', 'platform_code']]
calendar_dates_df = calendar_dates_df[['service_id', 'date']]
trips_df = trips_df[['route_id', 'service_id', 'trip_id', 'trip_headsign', 'direction_id']]
stop_times_df = stop_times_df[['trip_id', 'departure_time', 'stop_id', 'stop_headsign']]

print (f"Loaded {len(routes_df)} routes, {len(stops_df)} stops, {len(calendar_dates_df)} calendar dates, {len(trips_df)} trips, and {len(stop_times_df)} stop times.")

# Remove stop_times entries for stops without a departure time
# Stops without timepoints would have to be estimated
stop_times_df = stop_times_df[stop_times_df['departure_time'].notna()]
print("Removing untimed stops yields", len(stop_times_df), "rows.")

# Add route_id and service_id to stop_times_df to reduce queries later
# stop_times_df = stop_times_df.merge(trips_df[['trip_id', 'route_id', 'service_id']],
#   on='trip_id', how='left')
# This version also gives us the trip_headsign and direction_id
stop_times_df = stop_times_df.merge(trips_df, on='trip_id', how='inner')

# ------------- Create tables in SQLite DB -----------------

# We have agency_df, routes_df, stops_df,
# calendar_dates_df, trips_df, and stop_times_df
agency_df.to_sql('agency', conn, if_exists='replace')
routes_df.to_sql('routes', conn, if_exists='replace')
stops_df.to_sql('stops', conn, if_exists='replace')
calendar_dates_df.to_sql('calendar_dates', conn, if_exists='replace')
trips_df.to_sql('trips', conn, if_exists='replace')
stop_times_df.to_sql('stop_times', conn, if_exists='replace')

conn.close()
