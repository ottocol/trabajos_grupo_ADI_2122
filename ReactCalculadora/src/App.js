import './App.css';
import {useState} from 'react';
import * as math from "mathjs";

function App() {

  const [operation, setOperation] = useState("")
  const [result, setResult] = useState('')
  
  function clickValue(val){ setResult(''); setOperation(operation+val) }
  function clickEqual(){ setOperation(""); setResult(math.evaluate(operation)) }
  function clickAC(){ setOperation("") }
  function clickDel(){ setOperation(operation.substring(0,operation.length-1)) }
  return (
    <div className="App">
      <div className="calculator-grid">
        <div className="output">
          <div className="operation">{operation}</div>
          <div className="result">{result}</div>
        </div>
        <button className="span-two"  onClick={()=> {clickAC()}} >AC</button>
          <button onClick={()=> {clickDel()}} >DEL</button>
          <button onClick={()=> {clickValue('/')}}>/</button>
          <button onClick={()=> {clickValue(7)}}>7</button>
          <button onClick={()=> {clickValue(8)}}>8</button>
          <button onClick={()=> {clickValue(9)}}>9</button>
          <button onClick={()=> {clickValue('*')}}>*</button>
          <button onClick={()=> {clickValue(4)}}>4</button>
          <button onClick={()=> {clickValue(5)}}>5</button>
          <button onClick={()=> {clickValue(6)}}>6</button>
          <button onClick={()=> {clickValue('+')}}>+</button>
          <button onClick={()=> {clickValue(1)}}>1</button>
          <button onClick={()=> {clickValue(2)}}>2</button>
          <button onClick={()=> {clickValue(3)}}>3</button>
          <button onClick={()=> {clickValue('-')}}>-</button>
          <button onClick={()=> {clickValue('.')}}>.</button>
          <button onClick={()=> {clickValue(0)}}>0</button>
          <button onClick={()=> {clickEqual()}}className="span-two">=</button>
      </div>
    </div>
  );
}

export default App;
