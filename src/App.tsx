import './App.css';
import * as React from 'react';
import { useState } from 'react';

import RampCalc from './RampCalc.tsx';

function App() {
  const [totalCastTime, setTotalCastTime] = useState(0);

  const handleTotalCastTimeChange = (newTotalTime: number) => {
    setTotalCastTime(newTotalTime);
  };

  return (
      <div className="App">
        <header className="App-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ marginBottom: '0px' }}>When do I ramp?</h1>
          
          <RampCalc onTotalCastTimeChange={handleTotalCastTimeChange} />
          {totalCastTime > 0 && (
            <h1 style={{ marginTop: '0px' }}>
              Start ramping ~{Math.ceil(totalCastTime)}s before a mechanic
            </h1>
          )}
        </header>
      </div>
  );
}

export default App;
