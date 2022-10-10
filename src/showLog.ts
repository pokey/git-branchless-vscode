import { WorkspaceFolder } from "vscode";
import { branchlessCmd } from "./branchlessCmd";
import getTerminal from "./getTerminal";
import exec from "./exec";
import getOutputChannel from "./getOutputChannel";

export default async function showLog(workspaceFolder: WorkspaceFolder) {
  const terminal = getTerminal(workspaceFolder);
  terminal.runCommand(`${branchlessCmd()} smartlog`, false);
}

export async function showLogInOutputChannel(workspaceFolder: WorkspaceFolder) {
  const output = await exec(branchlessCmd(), ["smartlog"], {
    cwd: workspaceFolder.uri.fsPath,
  });
  getOutputChannel().append(output);
  getOutputChannel().show(true);
}
