import sqlite3

def create_connection():
    conn =sqlite3.connect('analysis.db')        # connect to a sqlite database file
    return conn

def create_table():
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analysis 
            (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            total_words INTEGER,
            unique_words INTEGER,
            most_common TEXT,
            rank_frequency TEXT    
            )
                   ''')
    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_table()
