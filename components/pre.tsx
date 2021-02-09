import React from "react"
import Prism from "prismjs"
import styled from "styled-components"

export default function Pre(source: any) {
  const [visible, setVisible] = React.useState(false)

  React.useLayoutEffect(() => {
    setVisible(false)
    Prism.highlightAll()
    setVisible(true)
  }, [source])

  return (
    <CodeContainer>
      <pre>
        <code className="lang-json" style={{ opacity: visible ? 1 : 0 }}>
          {JSON.stringify(source, null, 2)}
        </code>
      </pre>
    </CodeContainer>
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
