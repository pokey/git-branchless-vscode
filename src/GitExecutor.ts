import { BranchlessCommandOpts } from "./GitExecutorImpl";


export interface GitExecutor {
  runGitCmd(command: string, ...args: string[]): Promise<string>;
  runGitCmdCheck(command: string, ...args: string[]): Promise<boolean>;
  runBranchlessCmd(command: string, ...args: string[]): Promise<string>;
  runBranchlessCmdInTerminal(command: string, ...args: string[]): Promise<void>;
  runBranchlessCmdInTerminalAdvanced(
    command: string,
    opts: BranchlessCommandOpts
  ): Promise<void>;
}
