'use client'

import React from "react";
import dynamic from "next/dynamic";
const MonacoEditor = dynamic(() => import("react-monaco-editor"), { ssr: false });
import type { ParseOutput } from '@asyncapi/parser'
import Parser from '@asyncapi/parser/browser'

function App() {
  const [postBody, setPostBody] = React.useState("");

  (async () => {
    if (typeof window !== 'undefined') { // If we're on the browser...
      const parser = new Parser();

      const { document, diagnostics, extras }: ParseOutput = await parser.parse(`
      asyncapi: '2.4.0'
      info:
        title: Example AsyncAPI specification
        version: '0.1.0'
      channels:
        example-channel:
          subscribe:
            message:
              payload:
                type: object
                properties:
                  exampleField:
                    type: string
                  exampleNumber:
                    type: number
                  exampleDate:
                    type: string
                    format: date-time
      `);

      if (document) {
        // => Example AsyncAPI specification
        console.log(document.info().title());
      }

      console.log(diagnostics)
      console.log(extras)
    }
  })()

  return (<div>
    <MonacoEditor
      editorDidMount={() => {
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
      language="yaml"
      theme="vs-dark"
      value={"hello"}
      width={500}
    />
    <input type="text" value={postBody} onChange={(e) => setPostBody(e.target.value)} />
  </div>)
}

export default App;