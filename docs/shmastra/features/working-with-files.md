# Working with files

Every agent Shmastra generates is equipped with `queryDocumentsTool` —
a RAG tool built on top of [markitdown](https://github.com/microsoft/markitdown).
Upload a file in the chat and the agent can answer questions about it.

## Supported formats

PDF, DOCX, PPTX, XLSX, HTML, and anything else markitdown can convert
to text (that's most common office formats plus audio transcripts).
Processed text is capped at 200 000 characters per file.

## Example prompts

Drag a PDF into the widget (or click the paperclip), then:

> *Answer questions about this document.*

> *Summarise `report.pdf` in five bullet points.*

> *Pull every table from `forecast.xlsx` and return JSON.*

> *Read `handbook.pdf` — I want this agent to know it for every
> conversation.*

The last prompt is slightly different: it wires the file into the
agent's **instructions**, so every future chat starts with that
knowledge baked in.

## What happens

1. The file is saved under `files/` in the project root.
2. On localhost, Shmastra generates a temporary public URL so the
   agent (or a channel like Telegram) can reference it.
3. `queryDocumentsTool` converts the file to markdown with markitdown
   and answers your question in natural language.

## Structured data (CSV, XLSX)

For tables with many rows you usually want code, not natural-language
RAG. Ask the widget:

> *Give this agent a Python tool for analysing `sales.csv` with
> pandas.*

Shmastra bundles a `uv` Python runtime — the widget will wire it up
for you.

## Referencing files from agent output

The agent can return markdown links to any file in `files/`. On
localhost they resolve to the public URL automatically; in Shmastra
Cloud they resolve to the sandbox's public URL. No extra handler
needed.

## Tips

- **Name files explicitly.** *"The agent should answer questions about
  `policy.pdf` and `faq.md`"* is much better than *"about the files I
  upload"*.
- **Big spreadsheets → code.** If the file has more than a few hundred
  rows, don't rely on RAG — ask for a pandas/JS tool that queries it
  structurally.
- **Sensitive docs** stay on your machine. Shmastra doesn't upload
  them anywhere; LLM calls only see the extracted text that matches
  your question.
