import { JsonEditor } from "./components/JsonEditor";
import { useState } from "react";
import "./App.css";
import logo from "./assets/logo.svg";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [status, setStatus] = useState<
    "valid" | "invalid" | null
  >(null);
  const [copied, setCopied] = useState(false);

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

    setStatus("valid");

    setTimeout(() => {
      setStatus(null);
    }, 3000);
  } catch {
    setStatus("invalid");

    setTimeout(() => {
      setStatus(null);
    }, 3000);
  }
};

  const handleCopy = async () => {
  if (!outputValue || outputValue === "Invalid JSON") {
    return;
  }

  await navigator.clipboard.writeText(outputValue);

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
};

  const handleClear = () => {
  setInputValue("");
  setOutputValue("");
  setStatus(null);
  setCopied(false);
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
          onChange={(value) => {
            console.log("Input value changed:", value);
            setInputValue(value);
            setStatus(null);
  }}
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

         <button onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>

        <button onClick={handleClear}>
          Clear
        </button>
      </div>

{status && (
  <div className="validation-message">
    {status === "valid"
      ? "Valid JSON"
      : "Invalid JSON"}
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