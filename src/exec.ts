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
export default function exec(
  command: string,
  args: string[],
  options: cp.SpawnOptionsWithoutStdio
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const child = cp.spawn(command, args, options);

    let outputChannelPrepared = false;

    var scriptOutput = "";
    child.stdout.setEncoding("utf8").on("data", (data) => {
      scriptOutput += data.toString();
    });

    child.stderr.setEncoding("utf8").on("data", (data) => {
      if (!outputChannelPrepared) {
        outputChannelPrepared = true;
        getOutputChannel().append(`\n➜ ${command} ${args.join(" ")}\n`);
        getOutputChannel().show(true);
      }

      getOutputChannel().append(data.toString());
    });

    child.on("close", function (code) {
      if (code === 0) {
        resolve(scriptOutput);
      } else {
        reject(`Command ${command} failed with exit code ${code}`);
      }
    });
  });
}
