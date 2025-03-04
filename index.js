import { useState } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

export default function Home() {
  const [results, setResults] = useState(null);
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [calculationName, setCalculationName] = useState('Calculation');

  const handleCalculate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post('/api/calculate', data);
      setResults(response.data);
    } catch (error) {
      console.error('Error calculating:', error);
    }
  };

  const handleSave = () => {
    if (results) {
      const timestamp = new Date().toLocaleString();
      const savedData = {
        name: calculationName,
        timestamp,
        ...results,
      };
      setSavedCalculations([...savedCalculations, savedData]);
      alert('Calculation saved!');
    }
  };

  return (
    <div>
      <h1>Sphinx Initializer</h1>
      <form onSubmit={handleCalculate}>
        <div>
          <h2>Input Parameters</h2>
          <div>
            <label>Desired Thrust (N):</label>
            <input type="number" name="F" defaultValue={500} required />
          </div>
          <div>
            <label>Chamber Pressure (MPa):</label>
            <input type="number" name="P1" defaultValue={0.4} required />
          </div>
          {/* Add other input fields similarly */}
          <button type="submit">Calculate</button>
        </div>
      </form>

      {results && (
        <div>
          <h2>Output Parameters</h2>
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <label>Name this calculation:</label>
            <input
              type="text"
              value={calculationName}
              onChange={(e) => setCalculationName(e.target.value)}
            />
            <button onClick={handleSave}>Save Calculation</button>
          </div>
        </div>
      )}

      <div>
        <h2>Saved Calculations</h2>
        {savedCalculations.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Timestamp</th>
                {/* Add other columns as needed */}
              </tr>
            </thead>
            <tbody>
              {savedCalculations.map((calc, index) => (
                <tr key={index}>
                  <td>{calc.name}</td>
                  <td>{calc.timestamp}</td>
                  {/* Render other values */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No past calculations available.</p>
        )}
      </div>
    </div>
  );
}
