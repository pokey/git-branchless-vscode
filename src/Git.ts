import GitExecutor, { BranchlessCommandOpts } from "./GitExecutor";
import getOutputChannel from "./getOutputChannel";
import runBranchlessQuery from "./runBranchlessQuery";

export default class Git {
  constructor(private executor: GitExecutor) {}

  branch(...args: string[]) {
    return this.executor.runGitCmd("branch", ...args);
  }

  switch(...args: string[]) {
    return this.executor.runGitCmd("switch", ...args);
  }

  config(...args: string[]) {
    return this.executor.runGitCmd("config", ...args);
  }

  checkout(...args: string[]) {
    return this.executor.runGitCmd("checkout", ...args);
  }

  reset(...args: string[]) {
    return this.executor.runGitCmd("reset", ...args);
  }

  isBranch(name: string) {
    return this.executor.runGitCmdCheck(
      "show-ref",
      "--verify",
      "--quiet",
      `refs/heads/${name}`
    );
  }

  isClean() {
    return this.executor.runGitCmdCheck("diff", "--quiet");
  }

  query(query: string) {
    return runBranchlessQuery(this.executor, query);
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
    return this.executor.runBranchlessCmdInTerminal("smartlog");
  }

  async showLogInOutputChannel() {
    const output = await this.executor.runBranchlessCmd("smartlog");
    getOutputChannel().append(output);
    getOutputChannel().show(true);
  }

  detachHead() {
    return this.executor.runGitCmd("checkout", "--detach", "head");
  }

  branchlessSwitch(destination: string) {
    return this.executor.runBranchlessCmdInTerminal("switch", destination);
  }

  async getCurrentBranch() {
    return (await this.branch("--show-current")).trim();
  }

  async getMainBranch() {
    return (await this.config("branchless.core.mainBranch")).trim();
  }

  runBranchlessCmdInTerminalAdvanced(
    command: string,
    opts: BranchlessCommandOpts = {}
  ) {
    return this.executor.runBranchlessCmdInTerminalAdvanced(command, opts);
  }
}
