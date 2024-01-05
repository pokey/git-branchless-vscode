import * as vscode from "vscode";
import {
  BaseCommandDescription,
  InferArgType,
} from "./BaseCommandDescription.types";
import { GitCommandDescription } from "./CommandDescription.types";
import { commands } from "./commands/commands";
import handleCommandArg from "./handleCommandArg";
import { WorkspaceFolderParam } from "./paramHandlers";
import { getWorkspaceGit } from "./getWorkspaceGit";
import { getLogCallsPath } from "./getLogCallsPath";
import { logCall } from "./logCall";

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
        const error = err as Error;
        if (error.name !== "SilentError") {
          vscode.window.showErrorMessage(error.message);
        }
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
      const logCallsPath = getLogCallsPath();
      if (logCallsPath != null) {
        logCall(logCallsPath, { name: "run", arg: rest });
      }
      const git = getWorkspaceGit(workspaceFolder as vscode.WorkspaceFolder);
      return await run({ ...(rest as InferArgType<T>), git });
    },
  });
}

export function registerCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(...commands.map(registerGitCommand));
}
