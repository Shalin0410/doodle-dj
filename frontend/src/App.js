import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Make the API call
    fetch(`${process.env.REACT_APP_API_URL}/`) // Replace with the actual URL of your Flask app
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{message || 'Loading...'}</p>
      </header>
    </div>
  );
}

export default App;
