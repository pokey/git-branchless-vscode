import * as vscode from "vscode";
import { Terminal } from "./Terminal";
import sleep from "./sleep";

export class TerminalImpl implements Terminal {
  private terminal: vscode.Terminal | undefined;

  constructor(private workspaceFolder: vscode.WorkspaceFolder) {}

  /**
   * Run the command in the terminal.
   *
   * FIXME: The promise resolves immediately, rather than waiting for command
   * to complete.  Should probably switch to using tasks.
   * @param command The command to run
   * @param requireConfirmation Whether to ask user for confirmation before running the command
   */
  async runCommand(command: string, requireConfirmation: boolean) {
    if (this.terminal == null) {
      this.terminal = vscode.window.createTerminal({
        isTransient: true,
        name: "Git branchless",
        cwd: this.workspaceFolder.uri.fsPath,
      });
      await sleep(1000);
    }

    this.terminal.sendText(command, !requireConfirmation);
    this.terminal.show();
  }
}
