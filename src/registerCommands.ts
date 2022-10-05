import * as vscode from "vscode";
import { z } from "zod";
import { CommandArgDescription } from "./CommandDescription.types";
import { commands } from "./commands/commands";
import { parseOrDisplayError } from "./parseOrDisplayError";

let terminal: vscode.Terminal | undefined = undefined;

function constructExtraArgSchema(args: CommandArgDescription[]) {
  return z
    .object(
      Object.fromEntries(args.map(({ key }) => [key, z.string().optional()]))
    )
    .strict();
}

const CoreArgSchema = z
  .object({
    noConfirmation: z.boolean().optional(),
  })
  .strict();

export function registerCommands(context: vscode.ExtensionContext) {
  const disposables = commands.map(
    ({
      id,
      command,
      logAfter = false,
      args: expectedExtraArgs,
      noConfirmation: defaultNoConfirmation,
    }) =>
      vscode.commands.registerCommand(
        `git-branchless.${id}`,
        async (rawArg?: unknown) => {
          const extraArgSchema = constructExtraArgSchema(expectedExtraArgs);
          const parsed =
            parseOrDisplayError(
              CoreArgSchema.merge(extraArgSchema).optional(),
              rawArg
            ) ?? {};

          const coreArgs: z.infer<typeof CoreArgSchema> = parsed;
          const noConfirmation =
            defaultNoConfirmation ?? coreArgs.noConfirmation ?? false;

          const actualExtraArgs: z.infer<typeof extraArgSchema> = parsed;

          if (terminal == null) {
            terminal = vscode.window.createTerminal({ isTransient: true });
          }

          const commandArgs = [];
          for (const { key, flag, description } of expectedExtraArgs) {
            let value = actualExtraArgs[key];
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

          const showLogCommand = logAfter ? " && git-branchless smartlog" : "";
          terminal.sendText(
            `git-branchless ${command} ${commandArgString}${showLogCommand}`,
            noConfirmation
          );
          terminal.show();
        }
      )
  );

  context.subscriptions.push(...disposables);
}
