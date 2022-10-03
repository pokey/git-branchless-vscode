import * as vscode from "vscode";
import { z } from "zod";
import { CommandArgDescription } from "./CommandDescription.types";
import { commands } from "./commands/commands";

let terminal: vscode.Terminal | undefined = undefined;

function constructArgSchema(args: CommandArgDescription[]) {
  return z
    .object(
      Object.fromEntries(args.map(({ key }) => [key, z.string().optional()]))
    )
    .strict()
    .optional();
}

export function registerCommands(context: vscode.ExtensionContext) {
  const disposables = commands.map(({ id, command, args }) =>
    vscode.commands.registerCommand(
      `git-branchless.${id}`,
      async (rawArg?: unknown) => {
        const arg = constructArgSchema(args).parse(rawArg) ?? {};

        if (terminal == null) {
          terminal = vscode.window.createTerminal({ isTransient: true });
        }

        const commandArgs = [];
        for (const { key, flag, description } of args) {
          let value = arg[key];
          if (value == null) {
            // FIXME: Use quick pick with commits or whatever depending on arg type
            value = await vscode.window.showInputBox({ prompt: description });
            if (value == null) {
              // User cancelled
              return;
            }
          }
          commandArgs.push(`${flag} '${value}'`);
        }

        const commandArgString = commandArgs.join(" ");

        terminal.sendText(
          `git-branchless ${command} ${commandArgString} && git-branchless smartLog`,
          false
        );
        terminal.show();
      }
    )
  );

  context.subscriptions.push(...disposables);
}
