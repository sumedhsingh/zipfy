import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogLogGraph from './chart'; // Import the LogLogGraph component

function Results() {
  const [analysisId, setAnalysisId] = useState(''); // State to hold the analysis ID
  const [result, setResult] = useState(null); // State to hold the analysis result
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to manage errors
  const [rankFrequency, setRankFrequency] = useState(null); // State to hold rank-frequency data
  const [columns, setColumns] = useState([]); // State to hold column data
  const [zipfianScore, setZipfianScore] = useState(null); // State to hold the Zipfian score

  const columnsCount = 3; // Number of columns to display
  const rankLimit = 5000; // Limit for rank

  // Function to split data into columns
  const splitDataIntoColumns = (data) => {
    const chunkSize = Math.ceil(data.length / columnsCount);
    const result = [];
    for (let i = 0; i < columnsCount; i++) {
      result.push(data.slice(i * chunkSize, i * chunkSize + chunkSize));
    }
    return result;
  };

  // Function to fetch results based on analysis ID
  const fetchResult = async () => {
    setLoading(true); // Set loading state to true
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(`http://127.0.0.1:5000/analysis/${analysisId}`);
      setResult(response.data); // Set the result state with the fetched data

      // Fetch rank-frequency data
      const rankFrequencyResponse = await axios.get(`http://127.0.0.1:5000/analysis/${analysisId}/rankfreq`);
      
      // Filter data to include only up to the 5000th rank
      const filteredData = rankFrequencyResponse.data.filter(item => item[0] <= rankLimit);

      setRankFrequency(filteredData); // Set the rank-frequency state with the filtered data

      // Split data into columns
      if (filteredData) {
        setColumns(splitDataIntoColumns(filteredData));
      }

      // Fetch Zipfian score
      const zipfianScoreResponse = await axios.get(`http://127.0.0.1:5000/analysis/${analysisId}/zipfian_score`);
      setZipfianScore(zipfianScoreResponse.data.score); // Set the Zipfian score state with the fetched score

    } catch (error) {
      setError('Error fetching result'); // Set error state if an error occurs
    } finally {
      setLoading(false); // Set loading state to false regardless of the outcome
    }
  };

 // Return JSX to render the component
return (
  <div className="container mt-4">
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        value={analysisId}
        onChange={(e) => setAnalysisId(e.target.value)} // Update analysis ID state when input changes
        placeholder="Enter analysis ID"
      />
    </div>

    <div className="row">
      <div className="col-md-6 mb-3" style={{ textAlign: 'left' }}>
        <h4>Famous Corpora</h4>
        <ul>
          <li>18 : Sherlock Holmes</li>
          <li>20 : Bible</li>
          <li>21 : Wikipedia</li>
          <li>22 : Movies</li>
          <li>23 : TV Shows</li>
          <li>24 : Coronavirus</li>
        </ul>
      </div>
      <div className="col-md-6 mb-3" style={{ textAlign: 'left' }}>
        {/* Second column can be used if you have more data to display */}
      </div>
    </div>

    <button className="btn btn-primary" onClick={fetchResult}>Fetch Results</button> {/* Button to trigger fetching results */}
    
    {loading && <p>Loading...</p>} {/* Display loading text while fetching data */}
    {error && <p>{error}</p>} {/* Display error message if there's an error */}
    
    {result && !loading && !error && (
      <div className="mt-4">
        <div className="card text-white bg-success mb-3">
          <div className="card-body">
            <h3 className="card-title">Zipfy Score: {zipfianScore ? zipfianScore.toFixed(2) : 'N/A'}</h3>
            <p className="card-text">This score represents how closely the text follows Zipf's law, with 100 indicating a perfect match.</p>
          </div>
        </div>

        {rankFrequency && (
          <div className="mt-4">
            <h3>Log-Log Graph</h3>
            <LogLogGraph data={rankFrequency} /> {/* Pass the rank-frequency data to LogLogGraph component */}
          </div>
        )}

        <h2>Analysis Result</h2>
        <p>Total Words: {result.total_words}</p>
        <p>Unique Words: {result.unique_words}</p>
        <h3>Most Common Words</h3>
        <ul>
          {result.most_common.map((item, index) => ( // Show top 10 most common words
            <li key={index}>{item[0]}: {item[1]}</li>
          ))}
        </ul>
        <h3>Rank and Frequency</h3>
        <div className="row">
          {columns.map((column, index) => (
            <div key={index} className="col-md">
              <ul>
                {column.map((item, i) => (
                  <li key={i}>Rank {item[0]}: {item[1]}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);



  
}

export default Results;
