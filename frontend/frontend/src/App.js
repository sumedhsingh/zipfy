import './App.css';
import Form from './components/form.js';
import Results from './components/results.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Zipfy: The Zipf Law Analyser</h1>
      </header>
      <main>
        <Form /> {/*Render the form component*/}
        <Results /> {/*Render the Results component*/}
      </main>
    </div>
  );
}

export default App;
