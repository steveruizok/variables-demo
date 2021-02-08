import React from "react"
import Prism from "prismjs"

export default function Pre(source: any) {
  React.useEffect(() => {
    Prism.highlightAll()
  }, [source])

  return (
    <pre>
      <code className="lang-json">{JSON.stringify(source, null, 2)}</code>
    </pre>
  )
}
