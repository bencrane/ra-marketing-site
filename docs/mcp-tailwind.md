# Tailwind CSS MCP Server Documentation

## 1. Connection/Setup

**Server Type**: SSE-based (Server-Sent Events)
**URL**: `https://gitmcp.io/tailwindlabs/tailwindcss`

This MCP server connects directly to the Tailwind CSS GitHub repository (`tailwindlabs/tailwindcss`) to provide documentation and code search capabilities. It is hosted via GitMCP.

## 2. Available Tools

The server exposes the following tools:

### `fetch_tailwindcss_documentation`
- **Description**: Fetches the main documentation/README from the Tailwind CSS GitHub repository. This is the entry point for general information.
- **Parameters**: None
- **Returns**: The content of the main documentation file (Markdown).

### `search_tailwindcss_documentation`
- **Description**: Semantically searches within the fetched documentation from the GitHub repository.
- **Parameters**:
  - `query` (string, required): The search query to find relevant documentation.
- **Returns**: Relevant documentation snippets or sections matching the query.

### `search_tailwindcss_code`
- **Description**: Searches for code within the `tailwindlabs/tailwindcss` GitHub repository using the GitHub Search API.
- **Parameters**:
  - `query` (string, required): The search term (exact match).
  - `page` (number, optional): Page number to retrieve (starts at 1).
- **Returns**: A list of matching files with paths, URLs, and git blob URLs.

### `fetch_generic_url_content`
- **Description**: Fetches content from any absolute URL. This is useful for retrieving the full content of files found via the search tools.
- **Parameters**:
  - `url` (string, required): The absolute URL of the document or page to fetch.
- **Returns**: The content of the URL (typically raw text or code).

## 3. Available Resources

**Direct Resources**: None
The server does not expose static resources (like pre-loaded lists of utilities) via the `list_resources` capability. Instead, it relies on dynamic tools to fetch and search information from the repository.

**Knowledge Base**:
- Access to the full `tailwindlabs/tailwindcss` GitHub repository.
- Source code for Tailwind CSS packages (including `tailwindcss`, `@tailwindcss/browser`, `@tailwindcss/upgrade`).
- Documentation and changelogs located within the repository.

## 4. Example Usage

### Scenario 1: General Documentation Lookup
Get the main overview of the repository.

```json
{
  "name": "fetch_tailwindcss_documentation",
  "arguments": {}
}
```

### Scenario 2: Searching for Specific Concepts
Find documentation related to "preflight".

```json
{
  "name": "search_tailwindcss_documentation",
  "arguments": {
    "query": "preflight"
  }
}
```

### Scenario 3: Finding Implementation Details
Search for how "preflight" is implemented in the codebase.

```json
{
  "name": "search_tailwindcss_code",
  "arguments": {
    "query": "preflight"
  }
}
```
*Output typically includes file paths like `packages/@tailwindcss-upgrade/src/codemods/css/migrate-preflight.ts`.*

### Scenario 4: Reading a Specific File
After finding a file of interest (e.g., from Scenario 3), fetch its content.

```json
{
  "name": "fetch_generic_url_content",
  "arguments": {
    "url": "https://github.com/tailwindlabs/tailwindcss/blob/master/packages/tailwindcss/index.css"
  }
}
```

## 5. Tailwind Coverage

- **Versions**: Covers the latest code in the main branch, including upcoming features (e.g., v4 alpha/beta) as evidenced by packages like `@tailwindcss-upgrade`.
- **Scope**:
  - **Core Framework**: Source code for the engine, CLI, and browser integration.
  - **Utilities**: Definitions found within the repository's CSS and TypeScript files.
  - **Configuration**: Internal types and logic for `tailwind.config.js` handling.

## 6. Limitations & Gotchas

- **Documentation Indexing**: The `search_tailwindcss_documentation` tool searches within the *repository's* documentation (like READMEs), which may differ from the structured documentation site (tailwindcss.com). Simple queries like "colors" might not yield results if they aren't explicitly detailed in the repo's main docs.
- **GitHub API Limits**: The code search relies on the GitHub API, which has rate limits.
- **Raw Code vs. Docs**: This server is heavily biased towards *codebase* exploration. It is excellent for understanding how Tailwind works under the hood or finding migration scripts, but may be less effective for looking up simple utility class names compared to the official website.
- **No Resource Lists**: You cannot "list all colors" or "list all spacing utilities" as structured data; you would need to find the definition files in the code.
