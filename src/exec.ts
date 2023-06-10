import * as cp from "child_process";
import getOutputChannel from "./getOutputChannel";

/**
 * Runs a process using `spawn` and returns its output.  If there is any stderr
 * output, it shows it in a VSCode output channel.  Throws an exception on
 * nonzero exit code.
 *
 * Based on https://stackoverflow.com/a/32872753/
 *
 * @param command The command to run.
 * @param args List of string arguments.
 * @param options Options for spawning the process
 * @returns The output from the command
 */
export async function exec(
  command: string,
  args: string[],
  options: cp.SpawnOptionsWithoutStdio
): Promise<string> {
  const { stdout, code } = await execSub(command, args, options);

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
 * @param options Options for spawning the process
 * @returns The output from the command
 */
export async function execCheck(
  command: string,
  args: string[],
  options: cp.SpawnOptionsWithoutStdio
): Promise<boolean> {
  const { code } = await execSub(command, args, options);

  return code === 0;
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
