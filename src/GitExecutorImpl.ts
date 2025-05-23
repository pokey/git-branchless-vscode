import { branchlessCmd, gitCmd } from "./branchlessCmd";
import { Terminal } from "./Terminal";
import { Executor } from "./Executor";
import { Uri, env, window } from "vscode";
import { GitExecutor } from "./GitExecutor";

export interface BranchlessCommandOpts {
  args?: string[];
  dangerousRawArgString?: string;
  noConfirmation?: boolean;
  logAfter?: boolean;
}

export class GitExecutorImpl implements GitExecutor {
  private isGitReady = false;
  private isBranchlessReady = false;

  constructor(private terminal: Terminal, private executor: Executor) {}

  private async checkGit() {
    if (this.isGitReady) {
      return;
    }

    if (!(await this.executor.execCheck(gitCmd(), ["--version"]))) {
      throw new Error("Git not found. Please install git.");
    }

    if (
      !(await this.executor.execCheck(gitCmd(), [
        "rev-parse",
        "--is-inside-work-tree",
      ]))
    ) {
      throw new Error("Not currently in a git repo");
    }

    this.isGitReady = true;
  }

  private async checkGitBranchless() {
    await this.checkGit();

    if (this.isBranchlessReady) {
      return;
    }

    if (!(await this.executor.execCheck(branchlessCmd(), ["--version"]))) {
      const HOW = "How?";
      window
        .showErrorMessage(
          "git-branchless not found. Please install git-branchless.",
          HOW
        )
        .then((result) => {
          if (result === HOW) {
            env.openExternal(
              Uri.parse(
                "https://github.com/arxanas/git-branchless#installation"
              )
            );
          }
        });

      throw new SilentError("Branchless not found");
    }

    await this.checkGitBranchlessInit();

    this.isBranchlessReady = true;
  }

  private async checkGitBranchlessInit() {
    // Try to detect if the branchless config exists by asking git directly where the config is
    // This works for both regular repos and worktrees
    const gitDirCmd = await this.executor.exec(gitCmd(), [
      "rev-parse",
      "--git-common-dir",
    ]);
    const gitDir = gitDirCmd.trim();
    const branchlessConfigPath = `${gitDir}/branchless/config`;

    if (!(await this.executor.execCheck("stat", [branchlessConfigPath]))) {
      const RUN_IT_FOR_ME = "Run it for me";
      window
        .showErrorMessage(
          "git-branchless init must be run on the current repo.",
          RUN_IT_FOR_ME
        )
        .then((result) => {
          if (result === RUN_IT_FOR_ME) {
            this.terminal.runCommand(`${branchlessCmd()} init`, false);
          }
        });

      throw new SilentError("Branchless not initialized in repo");
    }
  }

  async runGitCmd(command: string, ...args: string[]) {
    await this.checkGitBranchless();
    return await this.executor.exec(gitCmd(), [command, ...args]);
  }

  async runGitCmdCheck(command: string, ...args: string[]) {
    await this.checkGitBranchless();
    return await this.executor.execCheck(gitCmd(), [command, ...args]);
  }

  async runBranchlessCmd(command: string, ...args: string[]) {
    await this.checkGitBranchless();
    return await this.executor.exec(branchlessCmd(), [command, ...args]);
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
    await this.checkGitBranchless();

    let argString =
      args?.map((arg) => `'${arg}'`).join(" ") ?? dangerousRawArgString ?? "";
    argString = argString === "" ? argString : ` ${argString}`;

    const showLogCommand = logAfter ? ` && ${branchlessCmd()} smartlog` : "";

    await this.terminal.runCommand(
      `${branchlessCmd()} ${command}${argString}${showLogCommand}`,
      !noConfirmation
    );
  }
}

class SilentError extends Error {
  name = "SilentError";
}
