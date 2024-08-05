import React, { useState } from 'react';
import axios from 'axios';
import LogLogGraph from './chart'; // Import the LogLogGraph component

function Results() {
  const [analysisId, setAnalysisId] = useState(''); // State to hold the analysis ID
  const [result, setResult] = useState(null); // State to hold the analysis result
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to manage errors
  const [rankFrequency, setRankFrequency] = useState(null); // State to hold rank-frequency data

  // Function to fetch results based on analysis ID
  const fetchResult = async () => {
    setLoading(true); // Set loading state to true
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(`http://127.0.0.1:5000/analysis/${analysisId}`);
      setResult(response.data); // Set the result state with the fetched data
      
      // Fetch rank-frequency data
      const rankFrequencyResponse = await axios.get(`http://127.0.0.1:5000/analysis/${analysisId}/rankfreq`);
      setRankFrequency(rankFrequencyResponse.data); // Set the rank-frequency state with the fetched data
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
      <button className="btn btn-primary" onClick={fetchResult}>Fetch Result</button> {/* Button to trigger fetching results */}
      
      {loading && <p>Loading...</p>} {/* Display loading text while fetching data */}
      {error && <p>{error}</p>} {/* Display error message if there's an error */}
      
      {result && !loading && !error && (
        <div className="mt-4">
          <h2>Analysis Result</h2>
          <p>Total Words: {result.total_words}</p>
          <p>Unique Words: {result.unique_words}</p>
          <h3>Most Common Words</h3>
          <ul>
            {result.most_common.map((item, index) => (
              <li key={index}>{item[0]}: {item[1]}</li>
            ))}
          </ul>
          <h3>Rank and Frequency</h3>
          <ul>
            {result.rank_frequency.map((item, index) => (
              <li key={index}>Rank {item[0]}: {item[1]}</li>
            ))}
          </ul>
        </div>
      )}

      {rankFrequency && (
        <div className="mt-4">
          <h3>Log-Log Graph</h3>
          <LogLogGraph data={rankFrequency} /> {/* Pass the rank-frequency data to LogLogGraph component */}
        </div>
      )}
    </div>
  );
}

export default Results;
