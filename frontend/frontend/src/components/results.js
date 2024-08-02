import React, { useState } from 'react';
import axios from 'axios';

function Results() {
  const [analysisId, setAnalysisId] = useState(''); // State to hold the analysis ID
  const [result, setResult] = useState(null); // State to hold the analysis result
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to manage errors

  // Function to fetch results based on analysis ID
  const fetchResult = async () => {
    setLoading(true); // Set loading state to true
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(`http://127.0.0.1:5000/analysis/${analysisId}`);
      setResult(response.data); // Set the result state with the fetched data
    } catch (error) {
      setError('Error fetching result'); // Set error state if an error occurs
    } finally {
      setLoading(false); // Set loading state to false regardless of the outcome
    }
  };

  // Return JSX to render the component
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Fetch Analysis Result</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={analysisId}
          onChange={(e) => setAnalysisId(e.target.value)} // Update analysis ID state when input changes
          placeholder="Enter analysis ID.."
        />
      </div>
      <button onClick={fetchResult} className="btn btn-primary">Fetch Result</button> {/* Button to trigger fetching results */}
      
      {loading && <p className="mt-3">Loading...</p>} {/* Display loading text while fetching data */}
      {error && <p className="mt-3 text-danger">{error}</p>} {/* Display error message if there's an error */}
      
      {result && !loading && !error && (
        <div className="mt-4">
          <h2>Analysis Result</h2>
          <p><strong>Total Words:</strong> {result.total_words}</p>
          <p><strong>Unique Words:</strong> {result.unique_words}</p>
          <h3>Most Common Words</h3>
          <ul className="list-group">
            {result.most_common.map((item, index) => (
              <li key={index} className="list-group-item">{item[0]}: {item[1]}</li>
            ))}
          </ul>
          <h3 className="mt-4">Rank and Frequency</h3>
          <ul className="list-group">
            {result.rank_frequency.map((item, index) => (
              <li key={index} className="list-group-item">Rank {item[0]}: {item[1]}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Results;
