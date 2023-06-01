#!/usr/bin/env python3

# Create a new database
# from pathlib import Path
# Path('my_data.db').touch()

import sqlite3
conn = sqlite3.connect('my_data.db')
c = conn.cursor()

# Create a table
c.execute('''CREATE TABLE IF NOT EXISTS dates (id INTEGER PRIMARY KEY, date TEXT, service_id TEXT)''')

