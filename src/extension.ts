import * as vscode from "vscode";
import * as fs from "fs/promises"; // For async file operations
import {
  Name,
  Call,
  Node,
  Engine,
  Program,
  Identifier,
  New as AstNew,
  PropertyLookup,
  String as AstString,
  Number as AstNumber,
} from "php-parser"; // Correct import for php-parser Engine

// Interface to hold the result of the PHP analysis
interface TypeInfo {
  type: string; // e.g., 'string', 'int', 'array<Product>', 'App\\\\Model\\\\User'
  sourceFile?: string; // Path to the PHP file where the type was determined
  sourceLine?: number; // Line number in the PHP file (1-indexed)
  docComment?: string; // Associated PHPDoc comment
  isEntity?: boolean; // Is it likely an object/entity?
  isCollection?: boolean; // Is it likely an array/collection?
  structure?: { [key: string]: TypeInfo }; // For objects/arrays, details about properties/elements
  // Add more fields as needed (e.g., method details)
}

// Cache for parsed ASTs to improve performance
const astCache = new Map<string, { ast: Program; timestamp: number }>();

// --- Placeholder Helper Functions --- START ---

/**
 * Finds potential PHP files that might assign variables to a given Smarty template.
 * This is a complex problem and this placeholder needs a real implementation
 * (e.g., workspace search for $smarty->display/fetch or user configuration).
 */
async function findRelevantPhpFiles(
  templatePath: string,
  workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined
): Promise<string[]> {
  console.log(
    `Smarty Peek: Searching for PHP files relevant to ${templatePath}`
  );
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return [];
  }
  try {
    // Search all PHP files, excluding vendor dirs. Limit results for performance.
    // A better approach might involve searching for $smarty->display/fetch calls with the template name.
    const files = await vscode.workspace.findFiles(
      "**/*.php",
      "**/vendor/**",
      150
    ); // Limit results
    console.log(`Smarty Peek: Found ${files.length} potential PHP files.`);
    return files.map((f) => f.fsPath);
  } catch (error) {
    console.error("Smarty Peek: Error searching for PHP files:", error);
    return [];
  }
}

/**
 * Parses a PHP file (using cache) and returns its AST.
 */
async function getParsedPhpAst(filePath: string): Promise<Program | null> {
  console.log(`Smarty Peek: Requesting AST for: ${filePath}`);
  try {
    const stats = await fs.stat(filePath);
    const cachedEntry = astCache.get(filePath);

    if (cachedEntry && cachedEntry.timestamp >= stats.mtimeMs) {
      console.log(`Smarty Peek: Using cached AST for ${filePath}`);
      return cachedEntry.ast;
    }

    console.log(`Smarty Peek: Parsing PHP file: ${filePath}`);
    const phpCode = await fs.readFile(filePath, { encoding: "utf8" });
    const parser = new Engine({
      parser: {
        extractDoc: true,
        php7: true,
      },
      ast: {
        withPositions: true,
      },
    });
    const ast = parser.parseCode(phpCode, filePath);
    console.log(`Smarty Peek: Successfully parsed ${filePath}`);

    // Update cache
    astCache.set(filePath, { ast: ast as Program, timestamp: stats.mtimeMs });

    return ast as Program;
  } catch (error: any) {
    // Handle file not found error gracefully
    if (error.code === "ENOENT") {
      console.warn(`Smarty Peek: PHP file not found: ${filePath}`);
      return null;
    }
    // Log other parsing errors
    if (error.lineNumber) {
      console.error(
        `Smarty Peek: Error parsing PHP ${filePath}:${error.lineNumber}:`,
        error.message
      );
    } else {
      console.error(
        `Smarty Peek: Error parsing PHP ${filePath}:`,
        error.message
      );
    }
    // Remove potentially faulty cache entry
    astCache.delete(filePath);
    return null;
  }
}

/**
 * Extracts the last PHPDoc comment string before a given node.
 */
function getLeadingDocComment(node: Node): string | undefined {
  if (node.leadingComments && node.leadingComments.length > 0) {
    // Find the last block comment that looks like PHPDoc
    for (let i = node.leadingComments.length - 1; i >= 0; i--) {
      const comment = node.leadingComments[i];
      if (comment.kind === "commentblock" && comment.value.startsWith("/**")) {
        return comment.value;
      }
    }
  }
  return undefined;
}

/**
 * Tries to infer the type of a PHP AST node (basic implementation).
 */
function inferPhpType(node: Node, phpFilePath: string): TypeInfo | null {
  let typeInfo: Partial<TypeInfo> = {
    sourceFile: phpFilePath,
    sourceLine: node.loc?.start.line,
  };

  switch (node.kind) {
    case "string":
      typeInfo.type = "string";
      break;
    case "number":
      typeInfo.type = String((node as AstNumber).value).includes(".")
        ? "float"
        : "int";
      break;
    case "boolean":
      typeInfo.type = "bool";
      break;
    case "array":
      typeInfo.type = "array";
      typeInfo.isCollection = true;
      // TODO: Future: Infer array item types by analyzing elements
      break;
    case "new":
      const newNode = node as AstNew;
      if (newNode.what.kind === "name") {
        // Handle simple class names
        typeInfo.type = (newNode.what as Name).name;
        typeInfo.isEntity = true;
      } else {
        // Handle dynamic class names or other complexities (less common)
        typeInfo.type = "object";
        typeInfo.isEntity = true;
      }
      break;
    case "variable":
      // Basic: Just mark as mixed. Real implementation needs scope analysis.
      typeInfo.type = "mixed";
      // TODO: Implement variable tracking logic here
      break;
    case "propertylookup":
    case "staticlookup":
    case "offsetlookup":
      // Basic: Mark complex lookups as mixed. Real implementation needs recursive type analysis.
      typeInfo.type = "mixed";
      // TODO: Implement recursive type analysis for properties/methods/array keys
      break;
    case "call":
      // Basic: Mark call results as mixed. Real implementation needs function/method return type analysis.
      typeInfo.type = "mixed";
      // TODO: Implement call return type analysis (check function def, @return doc)
      break;
    case "name":
      // Often refers to a class name or constant
      typeInfo.type = (node as Name).name;
      break;
    case "nullkeyword":
      typeInfo.type = "null";
      break;
    // Add more cases as needed (e.g., magic constants, other keywords)
    default:
      console.log(
        `Smarty Peek: Unhandled node kind for type inference: ${node.kind}`
      );
      return null; // Cannot infer type
  }

  // Try to get PHPDoc from the node itself (might be relevant for variables, assignments)
  typeInfo.docComment = getLeadingDocComment(node);

  return typeInfo as TypeInfo;
}

/**
 * Analyzes the PHP AST to find the type information for a specific Smarty variable.
 */
async function analyzeAstForVariable(
  ast: Program,
  targetVariableName: string,
  phpFilePath: string,
  token: vscode.CancellationToken
): Promise<TypeInfo | null> {
  console.log(
    `Smarty Peek: Analyzing AST of ${phpFilePath} for variable: ${targetVariableName}`
  );
  let foundInfo: TypeInfo | null = null;

  function visit(node: Node | null) {
    if (!node || foundInfo || token.isCancellationRequested) return;

    // Check for $someObject->assign('varName', $value)
    if (node.kind === "call") {
      const callNode = node as Call;

      // Check if it's a method call: $var->assign(...)?
      if (callNode.what.kind === "propertylookup") {
        // Use type assertion via unknown to bypass strict check
        const propLookup = callNode.what as unknown as PropertyLookup;

        // Check if the offset (the property/method being looked up) is an identifier
        if (propLookup.offset.kind === "identifier") {
          // Use type assertion via unknown
          const methodIdentifier = propLookup.offset as unknown as Identifier;
          const methodName = methodIdentifier.name;

          // SIMPLIFIED CHECK: Look for any method named 'assign' with >= 2 args
          if (methodName === "assign" && callNode.arguments.length >= 2) {
            const firstArg = callNode.arguments[0];
            // Check if the first argument is a string matching our target variable name
            if (
              firstArg.kind === "string" &&
              (firstArg as AstString).value === targetVariableName
            ) {
              console.log(
                `Smarty Peek: Found assign('${targetVariableName}', ...) in ${phpFilePath} at line ${node.loc?.start.line}`
              );
              const valueNode = callNode.arguments[1];

              foundInfo = inferPhpType(valueNode, phpFilePath);

              if (foundInfo) {
                // Enhance with doc comment from the assign call line
                foundInfo.docComment =
                  getLeadingDocComment(callNode) ?? foundInfo.docComment;
                // Point definition to the assign call line
                foundInfo.sourceLine =
                  callNode.loc?.start.line ?? foundInfo.sourceLine;
              }
              return; // Found assignment, stop traversal
            }
          }
        }
      }
      // TODO: Future: Could add checks for static calls Class::assign(...) or direct function calls assign(...)
    }

    // Recursively visit children
    for (const key in node) {
      if (token.isCancellationRequested || foundInfo) break;
      const value = (node as any)[key];
      if (value && typeof value === "object") {
        if (Array.isArray(value)) {
          for (const item of value) {
            if (token.isCancellationRequested || foundInfo) break;
            visit(item as Node | null);
          }
        } else if (value.kind) {
          // Check if it looks like an AST node
          visit(value as Node);
        }
      }
    }
  }

  visit(ast);

  if (foundInfo) {
    console.log(
      `Smarty Peek: Analysis result for ${targetVariableName} in ${phpFilePath}:`,
      JSON.stringify(foundInfo)
    );
  } else {
    console.log(
      `Smarty Peek: Variable ${targetVariableName} not found via assign() in ${phpFilePath}.`
    );
  }

  return foundInfo;
}

/**
 * Formats the analysis result into a Markdown string for the hover.
 */
function formatAnalysisResultAsMarkdown(
  variableName: string,
  result: TypeInfo
): vscode.MarkdownString {
  const markdown = new vscode.MarkdownString("", true);
  markdown.supportHtml = true;
  markdown.isTrusted = true; // Allows commands if we add them later

  const typeLabel = result.isCollection
    ? "Collection"
    : result.isEntity
    ? "Entity"
    : "Variable";
  markdown.appendMarkdown(`**${typeLabel}: \`${variableName}\`**\n\n`);
  markdown.appendMarkdown(`*Type:* \`${result.type}\`\n`);

  if (result.sourceFile) {
    const fileUri = vscode.Uri.file(result.sourceFile);
    const relativePath = vscode.workspace.asRelativePath(fileUri, false); // Don't include workspace folder name
    // Ensure sourceLine is a number > 0
    const line =
      typeof result.sourceLine === "number" && result.sourceLine > 0
        ? result.sourceLine
        : undefined;
    const args = line
      ? [fileUri, { selection: new vscode.Range(line - 1, 0, line - 1, 0) }]
      : [fileUri];
    const openCommandUri = vscode.Uri.parse(
      `command:vscode.open?${encodeURIComponent(JSON.stringify(args))}`
    );
    markdown.appendMarkdown(
      `*Defined in:* [${relativePath}${
        line ? `:${line}` : ""
      }](${openCommandUri})\n`
    );
  }
  if (result.docComment) {
    const cleanedDoc = result.docComment
      .replace(/^\/\*\*|\*\/$/g, "")
      .replace(/^\s*\*\s?/gm, "")
      .trim();
    if (cleanedDoc) {
      markdown.appendMarkdown(`\n---\n`);
      markdown.appendCodeblock(cleanedDoc, "phpdoc");
    }
  }

  // TODO: Implement structure display using result.structure when inference is improved
  // if (result.structure) { ... }

  return markdown;
}

/**
 * Creates a simple fallback Hover message when analysis fails.
 */
function createFallbackHover(
  variableName: string,
  range: vscode.Range,
  message: string
): vscode.Hover {
  const markdown = new vscode.MarkdownString("", true);
  markdown.supportHtml = true;
  markdown.appendMarkdown(`**Variable: \`${variableName}\`**\n\n`);
  markdown.appendMarkdown(`*Type:* Unknown\n`);
  markdown.appendMarkdown(`\n---\n<span style="color:gray;">${message}</span>`);
  return new vscode.Hover(markdown, range);
}

// --- Placeholder Helper Functions --- END ---

// Denne klasse håndterer logikken for at vise hover information
class SmartyHoverProvider implements vscode.HoverProvider {
  constructor(private context: vscode.ExtensionContext) {}

  /**
   * Giver hover information for et specifikt punkt i et dokument.
   * VS Code kalder denne metode, når brugeren holder musen over kode.
   */
  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | undefined> {
    // Return Promise<Hover>

    const smartyVariablePattern =
      /\{\$?[\w\-\>\[\]\.\$]+\}|(?<!\{)\$[\w\-\>\[\]\.]+/g;
    const wordRange = document.getWordRangeAtPosition(
      position,
      smartyVariablePattern
    );

    if (!wordRange) {
      return undefined;
    }

    let variableName = document.getText(wordRange);
    console.log(`Smarty Peek: Potential variable found: ${variableName}`);

    let cleanVariableName = variableName
      .replace(/^\{\$?/, "")
      .replace(/\}$/, "");
    if (cleanVariableName.startsWith("$")) {
      cleanVariableName = cleanVariableName.substring(1);
    }
    if (!cleanVariableName) {
      return undefined;
    }

    // Handle reserved $smarty variables immediately
    if (cleanVariableName.match(/^smarty\./)) {
      const markdown = new vscode.MarkdownString("", true);
      markdown.appendMarkdown(`**Reserved Variable: \`${variableName}\`**\n\n`);
      markdown.appendMarkdown(`Accesses Smarty's reserved variables.`);
      return new vscode.Hover(markdown, wordRange);
    }

    console.log(
      `Smarty Peek: Analyzing hover for clean variable: ${cleanVariableName}`
    );

    try {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      const potentialPhpFiles = await findRelevantPhpFiles(
        document.fileName,
        workspaceFolders
      );

      if (token.isCancellationRequested) return undefined;

      if (!potentialPhpFiles || potentialPhpFiles.length === 0) {
        console.log("Smarty Peek: No relevant PHP files found for analysis.");
        return createFallbackHover(
          cleanVariableName,
          wordRange,
          "Could not find relevant PHP file(s) for analysis."
        );
      }

      let analysisResult: TypeInfo | null = null;

      for (const phpFilePath of potentialPhpFiles) {
        if (token.isCancellationRequested) break;
        const ast = await getParsedPhpAst(phpFilePath);
        if (!ast) continue;
        analysisResult = await analyzeAstForVariable(
          ast,
          cleanVariableName,
          phpFilePath,
          token
        );
        if (analysisResult) break;
      }

      if (token.isCancellationRequested) return undefined;

      if (analysisResult) {
        console.log("Smarty Peek: Analysis successful, generating hover.");
        return new vscode.Hover(
          formatAnalysisResultAsMarkdown(cleanVariableName, analysisResult),
          wordRange
        );
      } else {
        console.log(
          "Smarty Peek: Analysis did not find type information for ${cleanVariableName}."
        );
        return createFallbackHover(
          cleanVariableName,
          wordRange,
          "Could not determine variable type from PHP analysis."
        );
      }
    } catch (error: any) {
      console.error(
        "Smarty Peek: Error during hover analysis:",
        error.message,
        error.stack
      );
      return createFallbackHover(
        cleanVariableName,
        wordRange,
        "An error occurred during analysis. Check Output > Smarty Peek for details."
      );
    }
  }
}

// Denne funktion kaldes kun én gang, når din extension aktiveres
export function activate(context: vscode.ExtensionContext) {
  console.log("Activating Smarty Peek extension...");

  // Opret en instans af vores Hover Provider, giv den context
  const smartyHoverProvider = new SmartyHoverProvider(context);

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: "smarty", scheme: "file" },
      smartyHoverProvider
    )
  );

  console.log("Smarty Peek extension activated successfully.");
}

// Denne funktion kaldes, når din extension deaktiveres
export function deactivate() {
  console.log("Deactivating Smarty Peek extension.");
  astCache.clear(); // Clear cache on deactivation
}
