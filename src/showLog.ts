import { WorkspaceFolder } from "vscode";
import { branchlessCmd } from "./branchlessCmd";
import getTerminal from "./getTerminal";

export default function showLog(workspaceFolder: WorkspaceFolder) {
  const terminal = getTerminal(workspaceFolder);
  terminal.runCommand(`${branchlessCmd()} smartlog`, false);
}
