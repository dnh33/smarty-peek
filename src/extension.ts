import * as vscode from "vscode";

// Denne klasse håndterer logikken for at vise hover information
class SmartyHoverProvider implements vscode.HoverProvider {
  /**
   * Giver hover information for et specifikt punkt i et dokument.
   * VS Code kalder denne metode, når brugeren holder musen over kode.
   */
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken // Bruges til at afbryde operationen hvis nødvendigt
  ): vscode.ProviderResult<vscode.Hover> {
    // Kan returnere Hover, null, eller undefined

    // Regulært udtryk til at matche potentielle Smarty variabler/stier
    // Inkluderer: {$var}, $var (udenfor {}), $var.prop, $var->prop, $var[key], $smarty.const.SOMETHING
    // Dette er stadig en FORENKLING og fanger måske ikke alt eller fanger for meget.
    const smartyVariablePattern =
      /\{\$?[\w\-\>\[\]\.\$]+\}|(?<!\{)\$[\w\-\>\[\]\.]+/g;
    const wordRange = document.getWordRangeAtPosition(
      position,
      smartyVariablePattern
    );

    if (!wordRange) {
      return undefined; // Intet relevant fundet ved markøren
    }

    // Få teksten fra det fundne område
    let variableName = document.getText(wordRange);
    console.log(`Smarty Peek: Potential variable found: ${variableName}`);

    // Normaliser variabelnavnet (fjern f.eks. {$...} og start '$')
    let cleanVariableName = variableName
      .replace(/^\{\$?/, "")
      .replace(/\}$/, "");
    if (cleanVariableName.startsWith("$")) {
      cleanVariableName = cleanVariableName.substring(1);
    }

    // --- START PÅ DEN KOMPLEKSE DEL (SIMULERET) ---
    // Her skal den rigtige logik implementeres for at analysere 'cleanVariableName'
    // og bestemme dens type, struktur og eventuelt værdi.
    // Dette kræver sandsynligvis analyse af PHP-filer eller andre metoder.

    let hoverContent: vscode.MarkdownString | undefined;
    const markdown = new vscode.MarkdownString("", true); // 'true' muliggør trusted content som kommandoer
    markdown.supportHtml = true; // Tillad lidt HTML for styling om nødvendigt

    // SIMULERET LOGIK BASERET PÅ NAVN
    if (cleanVariableName.match(/^user(\.|->|$)/)) {
      markdown.appendMarkdown(`**Entity: \`${cleanVariableName}\`**\n\n`);
      markdown.appendMarkdown(`*Class:* \`App\\Model\\User\` (guessed)\n`);
      markdown.appendCodeblock(
        `interface User {\n  id: number;\n  name: string;\n  email: string;\n  isActive: boolean;\n  address?: Address; // Nested entity\n  lastLogin: Date | null;\n  getUserType(): string; // Method\n}`,
        "typescript"
      );
      markdown.appendMarkdown(`\n---\n`);
      markdown.appendMarkdown(
        `<span style="color:gray;">Simulated data - Requires PHP analysis for real info.</span>`
      );
    } else if (cleanVariableName.match(/^products(\[|\.|->|$)/)) {
      markdown.appendMarkdown(`**Collection: \`${cleanVariableName}\`**\n\n`);
      markdown.appendMarkdown(`*Type:* \`array<Product>\` (guessed)\n`);
      markdown.appendMarkdown(`*Size:* Unknown (runtime)\n`);
      markdown.appendCodeblock(
        `// Structure of each Product element:\ninterface Product {\n  id: number;\n  sku: string;\n  name: string;\n  price: number;\n  description?: string;\n}`,
        "typescript"
      );
      markdown.appendMarkdown(`\n---\n`);
      markdown.appendMarkdown(
        `<span style="color:gray;">Simulated data - Requires PHP analysis for real info.</span>`
      );
    } else if (cleanVariableName.match(/^\$smarty\.*/)) {
      markdown.appendMarkdown(`**Reserved Variable: \`${variableName}\`**\n\n`);
      markdown.appendMarkdown(
        `Accesses Smarty's reserved variables (e.g., \`$smarty.get\`, \`$smarty.const\`, \`$smarty.now\`).\n`
      );
      markdown.appendMarkdown(`Refer to Smarty documentation for details.`);
    } else if (
      cleanVariableName.includes(".") ||
      cleanVariableName.includes("->") ||
      cleanVariableName.includes("[")
    ) {
      // Generisk gæt på property/method access eller array access
      markdown.appendMarkdown(
        `**Variable Access: \`${cleanVariableName}\`**\n\n`
      );
      markdown.appendMarkdown(`*Type:* Unknown (Requires analysis)\n`);
      markdown.appendMarkdown(`*Value:* Unknown (Runtime)\n`);
      markdown.appendMarkdown(`\n---\n`);
      markdown.appendMarkdown(
        `<span style="color:gray;">Simulated data - Requires PHP analysis for real info.</span>`
      );
    } else {
      // Simpel variabel
      markdown.appendMarkdown(`**Variable: \`${cleanVariableName}\`**\n\n`);
      markdown.appendMarkdown(`*Type:* Unknown (Requires analysis)\n`);
      markdown.appendMarkdown(`*Value:* Unknown (Runtime)\n`);
      markdown.appendMarkdown(`\n---\n`);
      markdown.appendMarkdown(
        `<span style="color:gray;">Simulated data - Requires PHP analysis for real info.</span>`
      );
    }

    hoverContent = markdown;
    // --- SIMULERET LOGIK SLUT ---

    if (hoverContent) {
      // Returner et Hover objekt med indholdet og det område, det dækker
      return new vscode.Hover(hoverContent, wordRange);
    }

    return undefined; // Returner intet hvis ingen information blev genereret
  }
}

// Denne funktion kaldes kun én gang, når din extension aktiveres
export function activate(context: vscode.ExtensionContext) {
  console.log("Activating Smarty Peek extension...");

  // Opret en instans af vores Hover Provider
  const smartyHoverProvider = new SmartyHoverProvider();

  // Registrer Hover Provider for 'smarty' sproget.
  // Resultatet (en 'Disposable') tilføjes til context.subscriptions,
  // så det automatisk ryddes op, når extensionen deaktiveres.
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      // Selector: Matcher filer med sproget 'smarty'
      { language: "smarty", scheme: "file" }, // Vær specifik om scheme for at undgå f.eks. settings-filer
      smartyHoverProvider
    )
  );

  // Eksempel på registrering af en kommando (hvis du tilføjer en i package.json)
  /*
    context.subscriptions.push(
        vscode.commands.registerCommand('smarty-peek.showInfo', () => {
            vscode.window.showInformationMessage('Smarty Peek: Showing information! (Not implemented yet)');
        })
    );
    */

  console.log("Smarty Peek extension activated successfully.");
}

// Denne funktion kaldes, når din extension deaktiveres (f.eks. når VS Code lukkes)
export function deactivate() {
  console.log("Deactivating Smarty Peek extension.");
  // Ressourcer tilføjet til context.subscriptions i activate() bliver automatisk ryddet op.
}
