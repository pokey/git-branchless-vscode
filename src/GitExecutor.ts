import { WorkspaceFolder } from "vscode";
import { branchlessCmd, gitCmd } from "./branchlessCmd";
import { exec, execCheck } from "./exec";
import getTerminal from "./getTerminal";

export interface BranchlessCommandOpts {
  args?: string[];
  dangerousRawArgString?: string;
  noConfirmation?: boolean;
  logAfter?: boolean;
}

export default class GitExecutor {
  constructor(private workspaceFolder: WorkspaceFolder) {}

  runGitCmd(command: string, ...args: string[]) {
    return exec(gitCmd(), [command, ...args], {
      cwd: this.workspaceFolder.uri.fsPath,
    });
  }

  runGitCmdCheck(command: string, ...args: string[]) {
    return execCheck(gitCmd(), [command, ...args], {
      cwd: this.workspaceFolder.uri.fsPath,
    });
  }

  runBranchlessCmd(command: string, ...args: string[]) {
    return exec(branchlessCmd(), [command, ...args], {
      cwd: this.workspaceFolder.uri.fsPath,
    });
  }

  runBranchlessCmdInTerminal(command: string, ...args: string[]) {
    return this.runBranchlessCmdInTerminalAdvanced(command, {
      args,
      noConfirmation: true,
    });
  }

  async runBranchlessCmdInTerminalAdvanced(
    command: string,
    {
      args,
      dangerousRawArgString,
      noConfirmation = false,
      logAfter = false,
    }: BranchlessCommandOpts = {}
  ) {
    const argString =
      args?.map((arg) => `'${arg}'`).join(" ") ?? dangerousRawArgString ?? "";

    const showLogCommand = logAfter ? ` && ${branchlessCmd()} smartlog` : "";

    await getTerminal(this.workspaceFolder).runCommand(
      `${branchlessCmd()} ${command} ${argString}${showLogCommand}`,
      !noConfirmation
    );
  }
}
