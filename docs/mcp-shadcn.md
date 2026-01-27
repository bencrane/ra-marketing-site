# Shadcn/UI MCP Server Documentation

## 1. Connection/Setup

The `user-shadcn` MCP server provides integration with the shadcn/ui component library, allowing you to discover, search, view, and add components directly from your IDE.

### Prerequisites

- **Configuration File**: The project must have a `components.json` file in the root directory. This file is generated when you initialize shadcn/ui in your project (e.g., via `npx shadcn@latest init`).
- **Dependencies**: A standard shadcn/ui setup requires `tailwindcss`, `class-variance-authority`, `clsx`, `tailwind-merge`, and other core dependencies as defined in your project's `package.json`.

### Verification

To verify the connection and see configured registries:

```json
{
  "server": "user-shadcn",
  "toolName": "get_project_registries",
  "arguments": {}
}
```

## 2. Available Tools

The following tools are exposed by the server.

### `get_project_registries`
Retrieves the configured registry names from `components.json`.
- **Arguments**: None.
- **Returns**: List of configured registries (e.g., `["@shadcn"]`).

### `list_items_in_registries`
Lists all available items (components, hooks, blocks) from the specified registries.
- **Arguments**:
  - `registries` (array of strings): Registry names to search (e.g., `["@shadcn"]`).
  - `limit` (number, optional): Max items to return.
  - `offset` (number, optional): Pagination offset.
- **Returns**: A list of items with their type (registry:ui, registry:block, etc.) and add commands.

### `search_items_in_registries`
Performs a fuzzy search for components.
- **Arguments**:
  - `registries` (array of strings): Registry names.
  - `query` (string): Search term.
  - `limit` (number, optional).
  - `offset` (number, optional).
- **Returns**: Matching items.

### `view_items_in_registries`
Retrieves detailed information and file content for specific items.
- **Arguments**:
  - `items` (array of strings): Item names with prefix (e.g., `["@shadcn/button"]`).
- **Returns**: Detailed JSON including file contents.

### `get_item_examples_from_registries`
Finds usage examples and full code demos for components.
- **Arguments**:
  - `registries` (array of strings).
  - `query` (string): Search term (e.g., "card-demo").
- **Returns**: Full implementation code of the example.

### `get_add_command_for_items`
Generates the CLI command to install specific components.
- **Arguments**:
  - `items` (array of strings): Items to add (e.g., `["@shadcn/button"]`).
- **Returns**: The CLI command string.

### `get_audit_checklist`
Provides a checklist to verify component integration.
- **Arguments**: None.
- **Returns**: A text checklist.

## 3. Available Components

The MCP server provides access to several categories of items. Below is a summarized list of core components available in the `@shadcn` registry.

### UI Components (`registry:ui`)
Standard accessible components:
- `accordion`
- `alert`, `alert-dialog`
- `aspect-ratio`
- `avatar`
- `badge`
- `breadcrumb`
- `button`
- `calendar`, `card`, `carousel`, `chart`
- `checkbox`, `collapsible`, `combobox`, `command`, `context-menu`
- `dialog`, `drawer`, `dropdown-menu`
- `form`
- `hover-card`
- `input`, `input-otp`
- `label`
- `menubar`
- `navigation-menu`
- `pagination`, `popover`, `progress`
- `radio-group`, `resizable`
- `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`
- `table`, `tabs`, `textarea`, `toggle`, `toggle-group`, `tooltip`

### Blocks (`registry:block`)
Pre-built sections and layouts:
- **Dashboard**: `dashboard-01`
- **Sidebar Layouts**: `sidebar-01` through `sidebar-16` (various styles like floating, inset, collapsible)
- **Authentication**: `login-01` to `login-05`, `signup-01` to `signup-05`, `otp-01` to `otp-05`
- **Calendar**: `calendar-01` to `calendar-32` (range pickers, time pickers, event slots)
- **Charts**: Extensive chart blocks (Area, Bar, Line, Pie, Radar, Radial) with various configurations (interactive, stacked, gradient, etc.)

### Hooks (`registry:hook`)
- `use-mobile`

### Themes (`registry:theme`)
- `theme-stone`, `theme-zinc`, `theme-neutral`, `theme-gray`, `theme-slate`

## 4. Example Usage

### Finding a Component
To find a card component:

```json
{
  "server": "user-shadcn",
  "toolName": "search_items_in_registries",
  "arguments": {
    "registries": ["@shadcn"],
    "query": "card"
  }
}
```

### Viewing Component Code
To inspect the code for the button component before adding it:

```json
{
  "server": "user-shadcn",
  "toolName": "view_items_in_registries",
  "arguments": {
    "items": ["@shadcn/button"]
  }
}
```

### Getting an Example
To see how to implement an accordion:

```json
{
  "server": "user-shadcn",
  "toolName": "get_item_examples_from_registries",
  "arguments": {
    "registries": ["@shadcn"],
    "query": "accordion-demo"
  }
}
```

### Adding a Component
To get the command to add a button and card:

```json
{
  "server": "user-shadcn",
  "toolName": "get_add_command_for_items",
  "arguments": {
    "items": ["@shadcn/button", "@shadcn/card"]
  }
}
```

## 5. Configuration Options

The MCP server relies on your project's `components.json` file. Key configurations in this file include:

- **`style`**: The style to use (e.g., "new-york", "default").
- **`rsc`**: Whether to use React Server Components.
- **`tailwind`**: Configuration for CSS variables, prefix, and config path.
- **`aliases`**: Import aliases for components and utils (e.g., `@/components`, `@/lib/utils`).

To change which registry is queried (e.g., if you have a private registry), update the registries configuration in your project setup or pass the custom registry name to the tools.

## 6. Limitations & Gotchas

- **`components.json` is Mandatory**: Most tools will fail or return errors if this file is missing from the workspace root.
- **Prefix Requirement**: When requesting specific items, you must often prefix them with the registry name (e.g., `@shadcn/button`, not just `button`).
- **Read-Only**: The MCP tools primarily *read* data (code, examples, lists). They do not execute shell commands directly to install dependencies (though they provide the commands for you to run).
- **Network**: The server fetches fresh data from the remote registry, so an internet connection is required.
