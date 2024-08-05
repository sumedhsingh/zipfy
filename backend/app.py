from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json,os
import logging
from werkzeug.utils import secure_filename
from functions import analyze_text, allowed_file, store_analysis
from db import create_connection
import numpy as np
from sklearn.linear_model import LinearRegression


app = Flask(__name__)                        # initialize flask app
app.config['Upload'] = 'uploads'             # folder for file uploads
app.config['Allowed_EXT'] = 'txt'            # allowed file extensions

logging.basicConfig(level=logging.DEBUG)

# if upload folder does not exist
if not os.path.exists(app.config['Upload']):
    os.makedirs(app.config['Upload'])

CORS(app)                                   # Enabling cross orgin resource sharing

# Default endpoint
@app.route('/')
def default():
    print("We have entered default endpoint")
    response = "Welcome to default endpoint of Zipfy!"
    return Response(response, mimetype='text/plain')


# 'analyze' endpoint for analyzing raw text
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text')                  # extract 'text' field from json otherwise default to empty
   
    if not text:
        return jsonify({"error":"No text provided"}),400
    
    analysis_result = analyze_text(text)
    id = store_analysis(text,analysis_result)
    return jsonify({
        "analysis_id": id,  # Include analysis_id in the response
        **analysis_result  # Include analysis result data in the response
    })



# 'upload' endpoint for analyzing a text file
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:         
        return jsonify({"error":"No file part in request"}),400
    
    file = request.files['file']            # get the file from the request

    if file.filename == '':
        return jsonify({"error":"No file selected"}),400
    
    if file and allowed_file(file.filename, app.config['Allowed_EXT']):
        filename = secure_filename(file.filename)                       # avoid problematic filenames
        file_path = os.path.join(app.config['Upload'],filename)
        file.save(file_path)

        with open(file_path,'r',encoding='utf-8') as f:
            text = f.read()

        analysis_result = analyze_text(text)
        store_analysis(text,analysis_result)

        return jsonify(analysis_result),200
    
    return jsonify({"error":"File extension not supported yet"}),400



# 'analysis' endpoint for fetching analysis from the DB
@app.route('/analysis/<int:analysis_id>', methods=['GET'])
def get_analysis(analysis_id):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM analysis WHERE id = ?",(str(analysis_id),))
    row = cursor.fetchone()
    conn.close()

    if row:
        result = {
            'id': row[0],
            'text': row[1],
            'total_words': row[2],
            'unique_words': row[3],
            'most_common': json.loads(row[4]),
            'rank_frequency': json.loads(row[5])
            }
        return jsonify(result)
    return jsonify({"error":"No record for the given ID"}),404



# Endpoint for fetching words and corresponding frequencies
@app.route('/analysis/<int:analysis_id>/wordfreq', methods =['GET'])
def get_word_frequencies(analysis_id):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT most_common FROM analysis WHERE id=?",(str(analysis_id),))
    row = cursor.fetchone()
    conn.close()

    # What row looks like
    # row = ('[["hello", 1], ["world", 1]]',)
    # row[0] = '[["hello", 1], ["world", 1]]'

    if row:
        most_common = json.loads(row[0])
        return most_common

    else:
        return jsonify({"error":"Word frequency for specified ID not found"}),404




@app.route('/analysis/<int:analysis_id>/rankfreq', methods=['GET'])
def get_rank_frequencies(analysis_id):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT rank_frequency FROM analysis WHERE id=?",(str(analysis_id),))
    row = cursor.fetchone()
    conn.close()

    if row:
        rank_frequency = json.loads(row[0])
        return rank_frequency
    else:
        return jsonify({"error":"Rank frequency for specified ID not found"})



# Endpoint for calculating Zipfian score
@app.route('/analysis/<int:analysis_id>/zipfian_score', methods=['GET'])
def get_zipfian_score(analysis_id):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT rank_frequency,total_words FROM analysis WHERE id=?", (str(analysis_id),))
    row = cursor.fetchone()
    conn.close()

    if row:
        rank_frequency = json.loads(row[0])
        total_words = row[1]

        if total_words < 1000:
            return jsonify({'score': 0})  # Return 0 for texts with fewer than 1000 words

        # Transform data to log-log scale
        ranks = [item[0] for item in rank_frequency]
        frequencies = [item[1] for item in rank_frequency]
        
        # Filter out non-positive values for valid log transformation
        valid_data = [(rank, freq) for rank, freq in zip(ranks, frequencies) if rank > 0 and freq > 0]
        ranks, frequencies = zip(*valid_data)

        # Convert to log scale
        X = np.log10(ranks).reshape(-1, 1)
        y = np.log10(frequencies)

        # Perform linear regression
        model = LinearRegression().fit(X, y)
        r_squared = model.score(X, y)  # R-squared value

        # Return the Zipfian score as JSON
        return jsonify({'score': r_squared * 100})  # Convert to percentage

    return jsonify({"error": "Rank frequency for specified ID not found"}), 404

if __name__ == "__main__":                  # for running the script independently
    app.run(debug=True)




