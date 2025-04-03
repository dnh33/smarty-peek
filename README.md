# Smarty Peek VS Code Extension

## Overview

**Smarty Peek** is a Visual Studio Code extension designed to enhance the development experience for Smarty templates (`.tpl` files), particularly within specific platforms like DanDomain webshops (though aiming for broader applicability). It provides hover information for Smarty variables, attempting to display their underlying PHP type and structure through static analysis.

**Goal:** The primary goal is to move beyond simple syntax highlighting and provide developers with insights into the data available within their templates, reducing the need to constantly check backend code or rely on guesswork.

## Features (Current Implementation)

- **Hover Information:** Provides hover details for variables (e.g., `{$myVar}`, `$anotherVar.property`) in `.tpl` files.
- **PHP Static Analysis:** Attempts to find where the variable is assigned in PHP code using `$object->assign('variableName', $value)`.
- **Basic Type Inference:** Infers types for simple assignments (strings, numbers, booleans, arrays, `new ClassName()`). More complex types (variables, property lookups, method calls) are currently marked as `mixed`.
- **PHPDoc Integration:** Extracts and displays relevant PHPDoc comments (`/** ... */`) found near the variable assignment in PHP.
- **Source Location:** Provides a link to the PHP file and line number where the assignment was found.
- **AST Caching:** Caches parsed PHP Abstract Syntax Trees (ASTs) in memory to improve performance on subsequent hovers.

## Requirements

- Visual Studio Code (Version specified in `package.json`, currently `^1.85.0`)
- Node.js and npm (for local development and installing dependencies)

## Installation (Marketplace)

_(Note: This section assumes future publication to the VS Code Marketplace. Currently, use the Local Development steps.)_

1.  Open VS Code.
2.  Go to the Extensions view (Ctrl+Shift+X).
3.  Search for "Smarty Peek".
4.  Click "Install".

## Local Development & Testing

Follow these steps to run and test the extension locally from the source code:

1.  **Clone the Repository:**

    ```bash
    git clone <repository-url>
    cd smarty-peek
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

    This installs the necessary libraries, including `php-parser`.

3.  **Compile the Extension:**

    - For a single build:
      ```bash
      npm run compile
      ```
    - For continuous building as you make changes:
      `bash
npm run watch
`
      This uses webpack to compile the TypeScript code in `src/` to JavaScript in `dist/`.

4.  **Launch Extension Development Host:**

    - Press `F5` in VS Code.
    - This will open a new VS Code window ([Extension Development Host]) with the `smarty-peek` extension loaded.

5.  **Test:**
    - In the [Extension Development Host] window, open a workspace containing Smarty `.tpl` files and potentially the corresponding PHP backend code (depending on your setup).
    - Open a `.tpl` file.
    - Hover your mouse over different Smarty variables (e.g., `{$user}`, `{$product->name}`, `$items[0]`).
    - Observe the hover information provided. Check the `Output` panel (select "Smarty Peek" from the dropdown) for detailed logging and potential errors.

## How it Works (`extension.ts` Insights)

The core logic resides in `src/extension.ts`:

1.  **Activation (`activate` function):**

    - When VS Code activates the extension (e.g., when a `.tpl` file is opened), this function runs.
    - It creates an instance of `SmartyHoverProvider` and registers it with VS Code's language features for the `smarty` language.

2.  **Hover Provider (`SmartyHoverProvider`):**

    - The `provideHover` method is triggered whenever you hover over code in a `.tpl` file.
    - **Variable Detection:** It uses a regular expression (`smartyVariablePattern`) to identify potential Smarty variables under the cursor.
    - **Variable Cleaning:** It normalizes the found text (e.g., removing `{` `}` `$` prefixes) to get the `cleanVariableName`.
    - **PHP File Search (`findRelevantPhpFiles`):**
      - _Limitation:_ Currently, this function performs a broad search for _all_ `.php` files in the workspace (excluding `vendor`), which is inefficient and may not find the _correct_ file responsible for the specific template. This needs improvement for targeted analysis (e.g., searching for `$smarty->display('template.tpl')`).
    - **AST Parsing (`getParsedPhpAst`):**
      - For each potential PHP file, it reads the content.
      - It uses the `php-parser` library to generate an Abstract Syntax Tree (AST) – a tree representation of the PHP code structure.
      - _Performance:_ It utilizes an in-memory cache (`astCache`) based on file modification times to avoid re-parsing unchanged PHP files repeatedly.
    - **AST Analysis (`analyzeAstForVariable`):**
      - It traverses the AST of the PHP file using a simple visitor pattern (`visit` function).
      - _Simplified Check:_ It currently looks for _any_ method call that looks like `$object->assign('targetVariable', $value)`. It checks if the method name is `assign` and the first argument matches the `cleanVariableName`. It does _not_ currently verify if `$object` is actually a Smarty instance, which is a simplification to avoid complex type checking issues encountered earlier.
      - **Value Inference (`inferPhpType`):** If an `assign` call is found, it calls `inferPhpType` on the `$value` node (the second argument).
        - This function checks the `kind` of the AST node (`string`, `number`, `new`, `variable`, etc.).
        - It returns basic type information for literals and `new ClassName()`.
        - _Limitation:_ For variables, property lookups, method calls, etc., it currently returns `mixed` as it doesn't yet trace the variable's origin or analyze class structures.
      - **PHPDoc Extraction (`getLeadingDocComment`):** It attempts to find and extract `/** ... */` comments immediately preceding the `assign` call or the assigned value node.
    - **Formatting (`formatAnalysisResultAsMarkdown`):**
      - Takes the `TypeInfo` result from the analysis.
      - Formats it into a user-friendly `MarkdownString`, including the type, a clickable link to the source PHP file/line, and the cleaned PHPDoc.
    - **Fallback (`createFallbackHover`):** If analysis fails or no information is found, it displays a basic hover indicating the type is unknown.

3.  **Deactivation (`deactivate` function):**
    - Clears the `astCache` when the extension is deactivated.

## Configuration

Currently, the extension does not expose any specific configuration settings via `settings.json`.

## Known Issues & Limitations (Current State)

- **Basic Type Inference:** Often shows `mixed` for variables, object properties, and method call results because it doesn't trace variable origins or analyze class definitions yet.
- **Inaccurate PHP File Discovery:** The `findRelevantPhpFiles` function is too broad and may analyze irrelevant files or miss the correct one. It needs to be more targeted (e.g., search for `$smarty->display/fetch` calls).
- **Simplified `assign` Detection:** The check for `$object->assign()` finds _any_ method named `assign`, which might lead to incorrect results if other classes use a method with the same name.
- **No Framework/Platform Context:** Does not have specific knowledge of frameworks like DanDomain, Symfony, Laravel, etc., to understand their specific controller/template/entity relationships.
- **Complex Path Analysis:** Cannot yet analyze nested properties or method calls like `{$user->address->getCity()}`.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests on the repository.
