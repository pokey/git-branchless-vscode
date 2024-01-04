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
      // FIXME: This is a hack to wait for the terminal to be ready. If we don't
      // do this, then the first command might happen before any init commands that
      // the terminal needs to run, and these will actually come in as input to the
      // first command!
      await sleep(100);
    }

    this.terminal.sendText(command, !requireConfirmation);
    this.terminal.show();
  }
}
