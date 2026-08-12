import { JsonEditor } from "./components/JsonEditor";
import { useState } from "react";
import "./App.css";

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
     <main className="app">
      <header className="app-header">
        <h1>AU-RA</h1>
        <p>JSON Formatter</p>
          <p>Format, validate and minify JSON instantly.</p>
      </header>

      <section className="editor-section">
        <div className="editor-header">
          <span>Input</span>
        </div>

        <JsonEditor
          editable={true}
          value={inputValue}
          onChange={setInputValue}
        />
      </section>

      <div className="actions">
        <button onClick={handleFormat}>
          Format
        </button>
      </div>

      <section className="editor-section">
        <div className="editor-header">
          <span>Output</span>
        </div>

        <JsonEditor
          editable={false}
          value={outputValue}
        />
      </section>
    </main>
  );
}

export default App;