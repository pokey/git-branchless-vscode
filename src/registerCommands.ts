import * as vscode from "vscode";
import {
  BaseCommandDescription,
  InferArgType,
} from "./BaseCommandDescription.types";
import { GitCommandDescription } from "./CommandDescription.types";
import Git from "./Git";
import GitExecutor from "./GitExecutor";
import { commands } from "./commands/commands";
import handleCommandArg from "./handleCommandArg";
import { WorkspaceFolderParam } from "./paramHandlers";

function registerCommand<T extends Record<string, any>>({
  id,
  params,
  run,
}: BaseCommandDescription<T>): vscode.Disposable {
  return vscode.commands.registerCommand(
    `git-branchless.${id}`,
    async (rawArg?: unknown) => {
      try {
        const arg = await handleCommandArg(params, rawArg);

        if (arg == null) {
          // User canceled
          return;
        }

        return await run(arg);
      } catch (err) {
        vscode.window.showErrorMessage((err as Error).message);
        throw err;
      }
    }
  );
}

function registerGitCommand<T extends Record<string, any>>({
  id,
  params,
  run,
}: GitCommandDescription<T>): vscode.Disposable {
  return registerCommand({
    id,
    params: {
      ...params,
      workspaceFolder: new WorkspaceFolderParam(),
    },
    async run({ workspaceFolder, ...rest }) {
      const git = new Git(
        new GitExecutor(workspaceFolder as vscode.WorkspaceFolder)
      );
      return await run({ ...(rest as InferArgType<T>), git });
    },
  });
}

export function registerCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(...commands.map(registerGitCommand));
}
