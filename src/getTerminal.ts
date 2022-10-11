import * as vscode from "vscode";

const terminals: Record<string, Terminal> = {};

class Terminal {
  constructor(private terminal: vscode.Terminal) {}

  /**
   * Run the command in the terminal.
   *
   * FIXME: The promise resolves immediately, rather than waiting for command
   * to complete.  Should probably switch to using tasks.
   * @param command The command to run
   * @param requireConfirmation Whether to ask user for confirmation before running the command
   */
  async runCommand(command: string, requireConfirmation: boolean) {
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
