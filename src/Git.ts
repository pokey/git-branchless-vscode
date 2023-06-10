import { WorkspaceFolder } from "vscode";
import { branchlessCmd, gitCmd } from "./branchlessCmd";
import { exec, execCheck } from "./exec";
import getTerminal from "./getTerminal";
import runBranchlessQuery from "./runBranchlessQuery";
import showLog from "./showLog";

export default class Git {
  constructor(private workspaceFolder: WorkspaceFolder) {}

  private runGitCmd(command: string, ...args: string[]) {
    return exec(gitCmd(), [command, ...args], {
      cwd: this.workspaceFolder.uri.fsPath,
    });
  }

  private runGitCmdCheck(command: string, ...args: string[]) {
    return execCheck(gitCmd(), [command, ...args], {
      cwd: this.workspaceFolder.uri.fsPath,
    });
  }

  private runBranchlessCmd(command: string, ...args: string[]) {
    return exec(branchlessCmd(), [command, ...args], {
      cwd: this.workspaceFolder.uri.fsPath,
    });
  }

  branch(...args: string[]) {
    return this.runGitCmd("branch", ...args);
  }

  switch(...args: string[]) {
    return this.runGitCmd("switch", ...args);
  }

  config(...args: string[]) {
    return this.runGitCmd("config", ...args);
  }

  checkout(...args: string[]) {
    return this.runGitCmd("checkout", ...args);
  }

  reset(...args: string[]) {
    return this.runGitCmd("reset", ...args);
  }

  isBranch(name: string) {
    return this.runGitCmdCheck(
      "show-ref",
      "--verify",
      "--quiet",
      `refs/heads/${name}`
    );
  }

  isClean() {
    return this.runGitCmdCheck("diff", "--quiet");
  }

  query(query: string) {
    return runBranchlessQuery(query, this.workspaceFolder);
  }

  async queryOne(query: string) {
    const commits = await this.query(query);

    if (commits.length !== 1) {
      throw new Error(
        `Must refer to a single commit; '${query}' refers to ${commits.length} commits`
      );
    }

    return commits[0];
  }

  showLog() {
    return showLog(this.workspaceFolder);
  }

  detachHead() {
    return this.runGitCmd("checkout", "--detach", "head");
  }

  async branchlessSwitch(destination: string) {
    await getTerminal(this.workspaceFolder).runCommand(
      `${branchlessCmd()} switch '${destination}'`,
      false
    );
  }

  async getCurrentBranch() {
    return (await this.branch("--show-current")).trim();
  }

  async getMainBranch() {
    return (await this.config("branchless.core.mainBranch")).trim();
  }
}
