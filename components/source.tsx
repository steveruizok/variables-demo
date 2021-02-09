import React from "react"
import Prism from "prismjs"
import styled from "styled-components"
import { System } from "lib"
import { Panel, PanelHeader, PanelBody, IconButton } from "./styled"
import { Eye, EyeOff } from "react-feather"
import state, { useSelector } from "state"

interface SourceProps {
  source: System.IVariable | System.IProperty
}

export default function Source({ source }: SourceProps) {
  const showSource = useSelector((state) => state.data.showSource)

  React.useLayoutEffect(() => {
    Prism.highlightAll()
  }, [source, showSource])

  return (
    <Panel>
      <PanelHeader>
        <h2>Source</h2>
        <IconButton
          title="Show data source"
          onClick={() => state.send("TOGGLED_SHOW_SOURCE")}
        >
          {showSource ? <Eye size={16} /> : <EyeOff size={16} />}
        </IconButton>
      </PanelHeader>
      {showSource && (
        <PanelBody>
          <CodeContainer>
            <pre>
              <code className="lang-json">
                {JSON.stringify(source, null, 2)}
              </code>
            </pre>
          </CodeContainer>
        </PanelBody>
      )}
    </Panel>
  )
}

const CodeContainer = styled.div`
  & pre {
    font-weight: 500;
    overflow: scroll;
    border-radius: var(--radius-2);
    font-size: var(--size-1);
    font-family: "Roboto Mono", monospace;
    line-height: 1.5;
  }

  & code {
    line-height: inherit;
    font-size: inherit;
    font-family: inherit;
  }
`
