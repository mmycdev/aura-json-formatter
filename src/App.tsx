import { JsonEditor } from "./components/JsonEditor";
import { useState } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const handleFormat = () => {
  try {
    const parsed = JSON.parse(inputValue);
    const formatted = JSON.stringify(parsed, null, 2);

    setOutputValue(formatted);
  } catch {
    setOutputValue("Invalid JSON");
  }
};

  return (
    <main>
      <JsonEditor 
        editable={true} 
        value={inputValue}
        onChange={setInputValue} 
      />

      <JsonEditor 
        editable={false} 
        value={outputValue}  
      />

      <button onClick={handleFormat}>
  Format
</button>

    </main>
  );
}

export default App;