import { JsonEditor } from "./components/JsonEditor";
import { useRef, useState } from "react";
import "./App.css";
import logo from "./assets/logo.svg";
import { formatJson, minifyJson, validateJson } from "./utils/json";
import { JsonTree } from "./components/JsonTree";
import { MAX_JSON_SIZE } from "./constants/limits";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [status, setStatus] = useState<"valid" | "invalid" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");
  const [viewMode, setViewMode] = useState<"code" | "tree">("code");
  const viewSwitchRef = useRef<HTMLDivElement>(null);

  const getJsonErrorMessage = (error: unknown): string => {
    if (error instanceof SyntaxError) {
      return error.message;
    }

    return "Invalid JSON";
  };

  const showError = (error: unknown) => {
    setOutputValue("");
    setStatus("invalid");
    setErrorMessage(getJsonErrorMessage(error));

    setTimeout(() => {
      setStatus(null);
      setErrorMessage("");
    }, 5000);
  };

  const handleViewDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const switchElement = viewSwitchRef.current;

    if (!switchElement) {
      return;
    }

    const rect = switchElement.getBoundingClientRect();
    const position = event.clientX - rect.left;

    setViewMode(position > rect.width / 2 ? "tree" : "code");
  };

  const handleFormat = () => {
    try {
      const formatted = formatJson(inputValue);

      setOutputValue(formatted);
    } catch (error) {
      showError(error);
    }
  };

  const handleMinify = () => {
    try {
      const minified = minifyJson(inputValue);

      setOutputValue(minified);
    } catch (error) {
      showError(error);
    }
  };

  const handleValidate = () => {
    try {
      validateJson(inputValue);

      setStatus("valid");
      setErrorMessage("");

      setTimeout(() => {
        setStatus(null);
      }, 5000);
    } catch (error) {
      setStatus("invalid");
      setErrorMessage(getJsonErrorMessage(error));

      setTimeout(() => {
        setStatus(null);
        setErrorMessage("");
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
    setErrorMessage("");
    setCopied(false);
    setFileName("");
    setViewMode("code");
  };

  const handleSwap = () => {
    const currentInput = inputValue;

    setInputValue(outputValue);
    setOutputValue(currentInput);
    setStatus(null);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > MAX_JSON_SIZE) {
      setStatus("invalid");
      setErrorMessage("File too large. Maximum file size is 10 MB.");

      event.target.value = "";

      setTimeout(() => {
        setStatus(null);
        setErrorMessage("");
      }, 5000);

      return;
    }

    const content = await file.text();

    setInputValue(content);
    setFileName(file.name);
    setStatus(null);
    setErrorMessage("");

    event.target.value = "";
  };

  const handleDownload = () => {
    if (!outputValue) {
      return;
    }

    const blob = new Blob([outputValue], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "formatted.json";

    link.click();

    URL.revokeObjectURL(url);
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
          <div className="editor-title">
            <span>Input</span>
            {fileName && <span className="file-name">{fileName}</span>}
          </div>

          <label className="file-button">
            Import JSON
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImport}
              hidden
            />
          </label>
        </div>

        <JsonEditor
          editable={true}
          value={inputValue}
          onChange={(value) => {
            setInputValue(value);
            setStatus(null);
            setErrorMessage("");
          }}
          onSizeLimitExceeded={() => {
            setStatus("invalid");
            setErrorMessage("JSON too large. Maximum JSON size is 10 MB.");
          }}

          placeholderText="Paste your JSON here..."
        />
      </section>

      <div className="actions">
        <button onClick={handleFormat}>Format</button>

        <button onClick={handleMinify}>Minify</button>

        <button onClick={handleSwap} disabled={!inputValue && !outputValue}>
          Swap
        </button>

        <button onClick={handleValidate}>Validate</button>

        <button onClick={handleCopy} disabled={!outputValue}>
          {copied ? "Copied!" : "Copy"}
        </button>

        <button
          className="clear-button"
          onClick={handleClear}
          disabled={!inputValue && !outputValue && !fileName}
        >
          Clear
        </button>
      </div>

      {status === "valid" && (
        <div className="validation-message">Valid JSON</div>
      )}

      {errorMessage && (
        <div className="error-message">
          <span>Invalid JSON</span>
          <small>{errorMessage}</small>
        </div>
      )}

      <section className="editor-section">
        <div className="editor-header">
          <span>Output</span>

          <div className="output-actions">
            <div
              ref={viewSwitchRef}
              className={`view-switch ${viewMode}`}
              onPointerDown={handleViewDrag}
              onPointerMove={(event) => {
                if (event.buttons === 1) {
                  handleViewDrag(event);
                }
              }}
            >
              <div className="view-switch-thumb" />

              <span className="view-option">Code</span>

              <span className="view-option">Tree</span>
            </div>

            <button
              className="file-button"
              onClick={handleDownload}
              disabled={!outputValue}
            >
              Download JSON
            </button>
          </div>
        </div>

        {viewMode === "code" ? (
          <JsonEditor editable={false} value={outputValue} />
        ) : (
          outputValue && <JsonTree key={outputValue} value={outputValue} />
        )}
      </section>
    </main>
  );
}

export default App;
