# Smarty Peek VS Code Extension

## Overview

**Smarty Peek** is a Visual Studio Code extension designed to enhance the development experience for Smarty templates (`.tpl` files), particularly within specific platforms like DanDomain webshops (though aiming for broader applicability). It provides hover information for Smarty variables, attempting to display their underlying structure.

**⚠️ Work in Progress & Simulated Data:** Please note that this version of Smarty Peek is currently under development. The hover information provided is **simulated** based on common variable names (especially those used in DanDomain) and does **not** involve actual analysis of your PHP backend code yet. The goal is to eventually implement real-time Smarty analysis.

## Features (Current Implementation)

- **DanDomain Specific Hover Information:** For other detected variable patterns that don't match the hardcoded names, it displays a generic message indicating the type is unknown.
- **Footer Information:** Hovers often include a footer like "Dandomain Smarty Tooltip" or indicating that the data is simulated and requires PHP analysis (which is not yet implemented).
- **Hover Provider:** Activates hover information when mousing over code in `.tpl` files.
- **Simulated Hover Information (Hardcoded):**
  - For specific, common variable names (like `user`, `general`, `page`, `settings`, `text`, `contactdata`, `currency`, `access`), it displays pre-defined Markdown showing a _guessed_ structure and type information, often labeled as "Smarty Object" or similar.
  - This data is based on common usage patterns (e.g., in DanDomain) and is **not dynamically generated** from your project's code.
- **Smarty Language Recognition:** Identifies `.tpl` files as the `smarty` language.
- **Variable Syntax Detection:** Uses regular expressions to detect patterns commonly used for Smarty variables (e.g., `{$var}`, `$var.prop`, `$var->prop`, `$var[key]`, `$smarty.const.X`).

## Requirements

- Visual Studio Code (Version specified in `package.json`, currently `^1.85.0`)
- Node.js and npm (for local development and installing dependencies)

## Installation (Marketplace)

_(Note: This section assumes future publication to the VS Code Marketplace. Currently, use the Local Development steps.)_

1. Open VS Code.
2. Go to the Extensions view (Ctrl+Shift+X).
3. Search for "Smarty Peek".
4. Click "Install".

## Local Development & Testing

Follow these steps to run and test the extension locally from the source code:

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd smarty-peek
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

   This installs the necessary libraries, including `php-parser`.

3. **Compile the Extension:**

   - For a single build:
     ```bash
     npm run compile
     ```
   - For continuous building as you make changes:
     ```bash
     npm run watch
     ```
     This uses webpack to compile the TypeScript code in `src/` to JavaScript in `dist/`.

4. **Launch Extension Development Host:**

   - Press `F5` in VS Code.
   - This will open a new VS Code window ([Extension Development Host]) with the `smarty-peek` extension loaded.

5. **Test:**

   - In the [Extension Development Host] window, open a workspace containing Smarty `.tpl` files and potentially the corresponding PHP backend code (depending on your setup).
   - Open a `.tpl` file.
   - Hover your mouse over different Smarty variables (e.g., `{$user}`, `{$product->name}`, `$items[0]`).
   - Observe the hover information provided. Check the `Output` panel (select "Smarty Peek" from the dropdown) for detailed logging and potential errors.

### Publishing the Extension

To publish the Smarty Peek extension to the VS Code Marketplace, follow these steps. This ensures you can share it with others and keep it updated:

1. **Install vsce**

   - Ensure Node.js is installed.
   - Run the following command in your terminal:
     ```bash
     npm install -g @vscode/vsce
     ```

2. **Get a Personal Access Token (PAT)**

   - Sign in to [dev.azure.com](https://dev.azure.com/) with your Microsoft account.
   - Create a new token with the "Marketplace (manage)" scope.

3. **Create a Publisher Profile**

   - Visit [marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage).
   - Create a publisher profile with a unique ID and name.
   - Authenticate by running:
     ```bash
     vsce login <publisher-id>
     ```
     Then enter your PAT when prompted.

4. **Prepare Your Extension**

   - Ensure all changes are committed to the repository.
   - Update `package.json` with your publisher ID, repository URL, and relevant keywords.
   - Include a `LICENSE` file in the project root.
   - Verify that `README.md` is current and accurate.

5. **Package and Publish**

   - Package the extension into a `.vsix` file:
     ```bash
     vsce package
     ```
   - Publish it to the marketplace:
     ```bash
     vsce publish
     ```
   - Alternatively, manually upload the `.vsix` file via the marketplace website.

6. **Update Your Extension**

   - For future updates, increment the version and publish using:
     ```bash
     vsce publish minor
     ```
     (You can also use `patch` or `major` depending on the update type.)

7. **Manage Post-Publication**

   - Use the marketplace manage page to monitor stats, edit details, or unpublish if needed.

**Note:** If you initially upload the `.vsix` file manually, you can still use `vsce publish minor` for subsequent updates, provided the publisher ID and extension ID remain consistent.

### Quick Reference Table

| Step                    | Action                                                             | Tool/Command         |
| ----------------------- | ------------------------------------------------------------------ | -------------------- |
| Install vsce            | Run `npm install -g @vscode/vsce`                                  | npm                  |
| Get PAT                 | Create via Azure DevOps, select "Marketplace (manage)" scope       | Azure DevOps UI      |
| Create Publisher        | Set up at marketplace, then `vsce login <publisher-id>`            | Marketplace UI, vsce |
| Prepare Extension       | Edit `package.json`, add LICENSE, commit changes                   | Manual editing       |
| Package and Publish     | Run `vsce package` then `vsce publish`, or upload `.vsix` manually | vsce                 |
| Update Version          | Use `vsce publish minor` for versioning                            | vsce                 |
| Manage Post-Publication | View/edit via manage page                                          | Marketplace UI       |

## How it Works (`extension.ts` Insights)

The core logic resides in `src/extension.ts`:

1. **Activation (`activate` function):**

   - Runs when VS Code activates the extension for `.tpl` files.
   - Creates and registers the `SmartyHoverProvider`.

2. **Hover Provider (`SmartyHoverProvider`):**

   - The `provideHover` method is triggered on hover.
   - **Variable Detection:** Uses a regex (`smartyVariablePattern`) to find potential Smarty syntax.
   - **Variable Cleaning:** Normalizes the found text (e.g., removing `{`, `}`, `$`).
   - **Simulated Logic:** Compares the `cleanVariableName` against a series of `if/else if` conditions matching hardcoded names (e.g., `user`, `general`, `settings`).
   - **Hardcoded Output:** If a name matches, it appends a predefined `MarkdownString` with the simulated structure/type information.
   - **Fallback:** If no specific name matches, it generates a generic "Unknown type" hover message.

3. **Deactivation (`deactivate` function):**

   - Currently minimal, primarily logs deactivation. (The `astCache` mentioned previously is no longer relevant in this version).

## Configuration

Currently, the extension does not expose any specific configuration settings via `settings.json`.

## Known Issues & Limitations (Current State)

- **Basic Type Inference:** Often shows `mixed` for variables, object properties, and method call results because it doesn't trace variable
  origins or analyze class definitions yet.
- **Complex Path Analysis:** Cannot yet analyze nested properties or method calls like `{$user->address->getCity()}`.
- **Hardcoded Recognition:** Only provides detailed (simulated) information for a predefined list of variable names. All other variables get a generic "Unknown" message.
- **Inaccurate PHP File Discovery:** The `findRelevantPhpFiles` function is too broad and may analyze irrelevant files or miss the correct
  one. It needs to be more targeted (e.g., search for `$smarty->display/fetch` calls).
- **No Context Awareness:** Lacks any understanding of the specific framework or project structure being used.
- **No PHP Analysis:** Does not read, parse, or analyze any PHP files. References to PHP analysis in comments or previous README versions are outdated for the current code.
- **Regex Limitations:** The variable detection regex might not cover all possible valid (or invalid) Smarty syntax permutations, or it might incorrectly identify non-variable code as a variable.
- **Simplified `assign` Detection:** The check for `$object->assign()` finds _any_ method named `assign`, which might lead to incorrect
  results if other classes use a method with the same name.
- **Simulated Data Only:** The primary limitation is that **all hover information is simulated**. It does not reflect the actual data types or structures defined in your specific PHP backend. As of now it contains DanDomain specific data.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests on the repository.
