import * as vscode from "vscode";
import { z } from "zod";
import { CommandArgDescription } from "./CommandDescription.types";
import { commands } from "./commands/commands";
import { parseOrDisplayError } from "./parseOrDisplayError";

let terminal: vscode.Terminal | undefined = undefined;

function constructArgSchema(args: CommandArgDescription[]) {
  return z
    .object({
      args: constructArgListSchema(args).optional(),
      noConfirmation: z.boolean().optional(),
    })
    .strict()
    .optional();
}

function constructArgListSchema(args: CommandArgDescription[]) {
  return z
    .object(
      Object.fromEntries(args.map(({ key }) => [key, z.string().optional()]))
    )
    .strict();
}

export function registerCommands(context: vscode.ExtensionContext) {
  const disposables = commands.map(({ id, command, args: expectedArgs }) =>
    vscode.commands.registerCommand(
      `git-branchless.${id}`,
      async (rawArg?: unknown) => {
        const { args: actualArgs = {}, noConfirmation = false } =
          parseOrDisplayError(constructArgSchema(expectedArgs), rawArg) ?? {};

        if (terminal == null) {
          terminal = vscode.window.createTerminal({ isTransient: true });
        }

        const commandArgs = [];
        for (const { key, flag, description } of expectedArgs) {
          let value = actualArgs[key];
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
          noConfirmation
        );
        terminal.show();
      }
    )
  );

  context.subscriptions.push(...disposables);
}
