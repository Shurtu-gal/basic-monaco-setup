'use client'

import React from "react";
import dynamic from "next/dynamic";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

function App() {
  const [postBody, setPostBody] = React.useState("");
  // etc
  return (<div>
  {/* etc */}
    <MonacoEditor
      editorDidMount={() => {
        // @ts-ignore
        console.log('Mount');
        window.MonacoEnvironment!.getWorkerUrl = (
          _moduleId: string,
          label: string
        ) => {
          if (label === "json")
            return "_next/static/json.worker.js";
          if (label === "css")
            return "_next/static/css.worker.js";
          if (label === "html")
            return "_next/static/html.worker.js";
          if (
            label === "typescript" ||
            label === "javascript"
          )
            return "_next/static/ts.worker.js";
          return "_next/static/editor.worker.js";
        };
      }}
      height={500}
      language="javascript"
      theme="vs-dark"
      value={postBody}
      onChange={setPostBody}
      width={500}
    />
  </div>)
}

export default App;