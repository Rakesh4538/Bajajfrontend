import React, { useState } from 'react';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [options, setOptions] = useState([]);

  const API_ENDPOINT = process.env.REACT_APP_API_URL || 'https://bajajbackend-oul9.onrender.com';

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setApiResponse(null);

    try {
      const parsedData = JSON.parse(jsonInput);

      const response = await fetch(`${API_ENDPOINT}/bhfl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from API');
      }

      const result = await response.json();
      setApiResponse(result);
    } catch (error) {
      setErrorMessage(
        error.message.includes('Unexpected token')
          ? 'Invalid JSON input format'
          : error.message
      );
    }
  };

  const displayResponse = () => {
    if (!apiResponse) return null;

    return (
      <div>
        {options.includes('Alphabets') && (
          <p>Alphabets: {apiResponse.alphabets.join(', ')}</p>
        )}
        {options.includes('Numbers') && (
          <p>Numbers: {apiResponse.numbers.join(', ')}</p>
        )}
        {options.includes('Highest lowercase alphabet') && (
          <p>Highest lowercase alphabet: {apiResponse.highest_lowercase_alphabet.join(', ')}</p>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>BFHL API Frontend</h1>
      <form onSubmit={handleFormSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON (e.g., { "data": ["A","C","z"] })'
        />
        <button type="submit">Submit</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {apiResponse && (
        <div>
          <h2>Select information to display:</h2>
          <select
            multiple
            value={options}
            onChange={(e) => setOptions(Array.from(e.target.selectedOptions, option => option.value))}
          >
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
          {displayResponse()}
        </div>
      )}
    </div>
  );
}

export default App;
