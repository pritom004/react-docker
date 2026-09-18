import React from 'react';
import logo from './logo.svg';
import './App.css';
// docker run -d -p 3000:3000 -v /app/node_modules -v ${pwd}:/app CHOKIDAR_USEPOLLING=true  ec475a8353321a9db156
// docker run -d -p 3000:3000 -e WATCHPACK_POLLING=true  -v /app/node_modules -v ${pwd}:/app  ec475a8353321a9db156
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
Pritom Chowdhury 
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React with Pritoms sdf
        </a>
      </header>
    </div>
  );
}

export default App;
