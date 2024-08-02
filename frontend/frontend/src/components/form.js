import React, { useState } from 'react'; // importing React and useState hook from React library
import axios from 'axios';             // axios for making http requests

// Define functional component called Form
function Form() {
    const [text, setText] = useState('');  // useState hook to manage state of the text input
    const [analysisId, setAnalysisId] = useState(''); // State to hold the analysis ID

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/analyze', { text });
            setAnalysisId(response.data.analysis_id); // Store the analysis ID from the response
        } catch (error) {
            console.error('Error analyzing text: ', error);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Text Analysis</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <textarea
                        id="textInput"
                        className="form-control"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text corpus here..."
                    />
                </div>
                <button type="submit" className="btn btn-primary">Send Text Corpus</button> {/* Button to send text corpus */}
            </form>
            {analysisId && (
                <div className="mt-4">
                    <h3>Analysis ID:</h3>
                    <p>{analysisId}</p> {/* Display the generated analysis ID */}
                </div>
            )}
        </div>
    );
}

export default Form;
