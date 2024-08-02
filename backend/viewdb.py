import sqlite3
import pandas as pd
from tabulate import tabulate

def view_table():
    conn = sqlite3.connect('analysis.db')  # Connect to the database
    df = pd.read_sql_query('SELECT * FROM analysis', conn)  # Read the table into a DataFrame
    print(tabulate(df, headers='keys', tablefmt='psql',showindex=False))  # Print as a formatted table
    conn.close()  # Close the connection

if __name__ == '__main__':
    view_table()
