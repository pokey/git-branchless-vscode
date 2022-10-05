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
    ({ id, command, noLog = false, args: expectedArgs }) =>
      vscode.commands.registerCommand(
        `git-branchless.${id}`,
        async (rawArg?: unknown) => {
          const extraArgSchema = constructExtraArgSchema(expectedArgs);
          const parsed =
            parseOrDisplayError(CoreArgSchema.merge(extraArgSchema), rawArg) ??
            {};
          const { noConfirmation = false } = parsed as z.infer<
            typeof CoreArgSchema
          >;
          const actualArgs: z.infer<typeof extraArgSchema> = parsed;

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

          const showLogCommand = noLog ? "" : " && git-branchless smartlog";
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
