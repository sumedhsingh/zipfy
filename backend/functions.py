from collections import Counter # counter helps count the occurences of each word
import re                       # for text processing
import sqlite3,json

def analyze_text(text):
    words = re.findall(r'[a-zA-Z]+', text.lower())     # find all words and convert to lowercase
    word_count = Counter(words)                        # frequency dictionary
    total_words = sum(word_count.values())

    # A lambda function is used on the fly
    sorted_words = sorted(word_count.items(), key=lambda item:item[1], reverse=True)  #(word,count)
    rank_freq = [(rank+1,freq) for rank, (word,freq) in enumerate(sorted_words)]

    return {
        "total_words": total_words,       # Total number of words
        "unique_words": len(word_count),  # Number of unique words
        "most_common": sorted_words[:5],  # Top 5 most common words
        "rank_frequency": rank_freq       # Rank and frequency list
    }

def store_analysis(text,analysis_result):
    conn =sqlite3.connect('analysis.db')
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO analysis (text, total_words, unique_words, most_common, rank_frequency)
        VALUES (?,?,?,?,?)       
        ''', (text, analysis_result["total_words"],analysis_result["unique_words"],
              json.dumps(analysis_result["most_common"]),json.dumps(analysis_result["rank_frequency"]))
                )
    conn.commit()
    analysis_id = cursor.lastrowid  # Get the ID of the inserted row
    conn.close()
    return analysis_id

def allowed_file(filename,allowed_ext):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_ext

def clear_table():
    conn = sqlite3.connect('analysis.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM analysis")
    conn.commit()
    conn.close()

