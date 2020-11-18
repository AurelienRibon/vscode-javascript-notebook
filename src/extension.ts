import * as vscode from 'vscode';
import { Notebook } from './lib/notebook';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('javascript-notebook.runNotebook', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const text = editor.document.getText();
    const notebook = new Notebook();
    notebook.refresh(text);

    await editor.edit((eb) => {
      for (let i = notebook.blocks.length - 1; i >= 0; --i) {
        const block = notebook.blocks[i];

        if (block.dirty) {
          const [startLine, endLine] = block.resultRange;
          const range = new vscode.Range(startLine, 0, endLine, 0);

          const linesDiff = startLine - notebook.linesCount + 1;
          const prefix = linesDiff > 0 ? '\n'.repeat(linesDiff) : '';
          const suffix = '\n';

          eb.replace(range, prefix + block.result + suffix);
        }
      }
    });
  });

  context.subscriptions.push(disposable);
}
