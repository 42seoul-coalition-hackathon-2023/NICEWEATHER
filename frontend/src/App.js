import logo from './logo.svg';
import './App.css';
import EvaluationWeather from './EvaluationWeather';

function App() {
  fetch('http://localhost:4000/main/')
    .then((response) => response.json())
    .then((data) => console.log(data));
    
  return (
    <EvaluationWeather></EvaluationWeather>
  );
}

export default App;
