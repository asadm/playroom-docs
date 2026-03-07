# Playroom Docs

These docs are based on [Nextra](https://nextra.site).

[**Link →**](https://docs.joinplayroom.com)

## Features

### llms.txt Support
Access LLM-optimized documentation at `/api/llms.txt`. This endpoint aggregates all documentation into a structured format that's easy for AI assistants to consume.

- Production: `https://docs.joinplayroom.com/api/llms.txt`
- Local: `http://localhost:3000/api/llms.txt`

See [LLMS-TXT.md](./LLMS-TXT.md) for details.

### Copy Markdown Button
Every documentation page includes a "Copy Markdown" button in the navbar, allowing users to easily copy the raw markdown content for sharing, editing, or offline reference.

See [COPY-MARKDOWN.md](./COPY-MARKDOWN.md) for details.

## Local Development

First, run `npm i` to install the dependencies.

Then, run `npm run dev` to start the development server and visit localhost:3000.

## License

This project is licensed under the MIT License.
