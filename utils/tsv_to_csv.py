#!/usr/bin/env python3

import sys
import csv

# Define the usage message
usage = f"Usage: {sys.argv[0]} [input_file] [output_file]"

# Check if the input and output file names were provided as arguments
if len(sys.argv) == 3:
    input_file = sys.argv[1]
    output_file = sys.argv[2]
elif len(sys.argv) == 1:
    input_file = input("Enter the name of the input file: ")
    output_file = input("Enter the name of the output file: ")
else:
    print(usage)
    exit()

# Open the input file and read the tab-separated values
try:
    with open(input_file, 'r') as f:
        reader = csv.reader(f, delimiter='\t')
        data = [row for row in reader]
except FileNotFoundError:
    print(f"Error: File '{input_file}' not found.")
    exit()

# Open the output file and write the comma-separated values
try:
    with open(output_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(data)
except IOError:
    print(f"Error: Could not open file '{output_file}' for writing.")
    exit()

print(f"Successfully converted {input_file} to {output_file}")
