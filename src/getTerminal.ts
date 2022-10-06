import * as vscode from "vscode";

const terminals: Record<string, Terminal> = {};

class Terminal {
  constructor(private terminal: vscode.Terminal) {}

  runCommand(command: string, requireConfirmation: boolean) {
    this.terminal.sendText(command, !requireConfirmation);
    this.terminal.show();
  }
}

export default function getTerminal(workspaceFolder: vscode.WorkspaceFolder) {
  const uriString = workspaceFolder.uri.toString();
  let terminal = terminals[uriString];

  if (terminal != null) {
    return terminal;
  }

  terminal = new Terminal(
    vscode.window.createTerminal({
      isTransient: true,
      name: "Git branchless",
      cwd: workspaceFolder.uri.fsPath,
    })
  );

  terminals[uriString] = terminal;

  return terminal;
}
