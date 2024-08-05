import React, { useState } from 'react'; // importing React and useState hook from React library
import axios from 'axios';             // axios for making http requests

// Define functional component called Form
function Form() {
    const [text, setText] = useState('');  // useState hook to manage state of the text input
    const [analysisId, setAnalysisId] = useState(''); // State to hold the analysis ID
    const [file, setFile] = useState(null); // State to hold the file

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = () => {
                setText(reader.result); // Set text area content to file content
            };
            reader.readAsText(selectedFile);
            setFile(selectedFile); // Set the selected file
        }
    };
    
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
            <h1 className="mb-4 text-center">Text Analysis</h1> {/* Centered heading */}
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light"> {/* Added padding, border, shadow, and background color */}
                        <div className="form-group mb-3">
                            <textarea
                                id="textInput"
                                className="form-control"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Copy text corpus here or upload a file..."
                                rows="6" 
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input 
                                type="file" 
                                accept=".txt" 
                                className="form-control-file" 
                                onChange={handleFileChange} 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg">Send Text Corpus</button> {/* Larger button */}
                    </form>
                    {analysisId && (
                        <div className="mt-4 text-center">
                            <h3>Analysis ID:</h3>
                            <p className="font-weight-bold">{analysisId}</p> {/* Bold text for analysis ID */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    
} 

export default Form;
