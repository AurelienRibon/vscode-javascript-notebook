import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('javascript-notebook.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from Javascript Notebook!');
  });

  context.subscriptions.push(disposable);
}
