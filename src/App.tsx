import { JsonEditor } from "./components/JsonEditor";
import { useState } from "react";
import "./App.css";
import logo from "./assets/logo.svg";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const handleFormat = () => {
  try {
    const parsed = JSON.parse(inputValue);
    const formatted = JSON.stringify(parsed, null, 2);

    setOutputValue(formatted);
  } catch {
    setOutputValue("Invalid JSON");
  }
};

  const handleMinify = () => {
  try {
    const parsed = JSON.parse(inputValue);
    const minified = JSON.stringify(parsed);

    setOutputValue(minified);
  } catch {
    setOutputValue("Invalid JSON");
  }
};

  const handleValidate = () => {
  try {
    JSON.parse(inputValue);

    setValidationMessage("Valid JSON");
  } catch {
    setValidationMessage("Invalid JSON");
  }
};

  return (
     <main className="app">
      <header className="app-header">
        <img src={logo} alt="AU-RA" className="app-logo" />
        <h2>JSON Formatter</h2>
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

        <button onClick={handleMinify}>
    Minify
  </button>

  <button onClick={handleValidate}>
  Validate
</button>
      </div>

      {validationMessage && (
  <div className="validation-message">
    {validationMessage}
  </div>
)}

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