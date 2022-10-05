import * as vscode from "vscode";
import { commands } from "./commands/commands";

export function registerCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    ...commands.map(({ id, run }) => {
      return vscode.commands.registerCommand(`git-branchless.${id}`, run);
    })
  );
}
