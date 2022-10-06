import * as cp from "child_process";
import * as vscode from "vscode";
import { CommandDescription, InferArgType } from "../CommandDescription.types";
import { RevsetParam } from "../paramHandlers";

function exec(
  command: string,
  options: cp.ExecOptions
): Promise<{ stdout: string; stderr: string }> {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    cp.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      }
      resolve({ stdout, stderr });
    });
  });
}

let _channel: vscode.OutputChannel;
function getOutputChannel(): vscode.OutputChannel {
  if (!_channel) {
    _channel = vscode.window.createOutputChannel("Git branchless");
  }
  return _channel;
}

const params = {
  revset: new RevsetParam(
    "A revset specifying the commits to add branch names to"
  ),
};
type ArgType = InferArgType<typeof params>;

const autoBranch: CommandDescription<ArgType> = {
  id: "custom.autoBranch",
  params,
  async run({ revset }) {
    console.log(revset);
  },
};

export default autoBranch;
