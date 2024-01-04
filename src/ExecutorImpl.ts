import * as cp from "child_process";
import getOutputChannel from "./getOutputChannel";
import { WorkspaceFolder } from "vscode";
import { Executor } from "./Executor";

export class ExecutorImpl implements Executor {
  constructor(private workspaceFolder: WorkspaceFolder) {}

  /**
   * Runs a process using `spawn` and returns its output.  If there is any stderr
   * output, it shows it in a VSCode output channel.  Throws an exception on
   * nonzero exit code.
   *
   * Based on https://stackoverflow.com/a/32872753/
   *
   * @param command The command to run.
   * @param args List of string arguments.
   * @returns The output from the command
   */
  async exec(command: string, args: string[]): Promise<string> {
    const { stdout, code } = await execSub(command, args, {
      cwd: this.workspaceFolder.uri.fsPath,
    });

    if (code === 0) {
      return stdout;
    }

    getOutputChannel().show(true);
    throw Error(`Command ${command} failed with exit code ${code}`);
  }

  /**
   * Runs a process using `spawn` and returns a boolean indicated whether it
   * succeeded.
   *
   * Based on https://stackoverflow.com/a/32872753/
   *
   * @param command The command to run.
   * @param args List of string arguments.
   * @returns The output from the command
   */
  async execCheck(command: string, args: string[]): Promise<boolean> {
    const { code } = await execSub(command, args, {
      cwd: this.workspaceFolder.uri.fsPath,
    });

    return code === 0;
  }
}

interface ExecOutput {
  stdout: string;
  code: number | null;
}

function execSub(
  command: string,
  args: string[],
  options: cp.SpawnOptionsWithoutStdio
) {
  return new Promise<ExecOutput>((resolve) => {
    const child = cp.spawn(command, args, options);

    let outputChannelPrepared = false;

    var stdout = "";
    child.stdout.setEncoding("utf8").on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.setEncoding("utf8").on("data", (data) => {
      if (!outputChannelPrepared) {
        outputChannelPrepared = true;
        getOutputChannel().append(`\n➜ ${command} ${args.join(" ")}\n`);
      }

      getOutputChannel().append(data.toString());
    });

    child.on("close", function (code) {
      resolve({ stdout, code });
    });
  });
}
