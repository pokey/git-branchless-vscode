import * as vscode from "vscode";
import { CommandDescription } from "./CommandDescription.types";
import { commands } from "./commands/commands";
import handleCommandArg from "./commands/handleCommandArg";

function registerCommand<T extends Record<string, any>>({
  id,
  params,
  run,
}: CommandDescription<T>): vscode.Disposable {
  return vscode.commands.registerCommand(
    `git-branchless.${id}`,
    async (rawArg?: unknown) => {
      const arg = await handleCommandArg(params, rawArg);

      if (arg == null) {
        // User canceled
        return;
      }

      return await run(arg);
    }
  );
}

export function registerCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(...commands.map(registerCommand));
}
