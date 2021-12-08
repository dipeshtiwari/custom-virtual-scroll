import './App.css';
import Grid from './Grid';
import Grid2 from './Grid2';
import React from "react";
function App() {
  return (
    <div className="App">
    {/* <Grid data={jsonData} />  */}
    <Grid2
        itemCount={1000}
        height={700}
      />
    </div>
  );
}

export default App;
