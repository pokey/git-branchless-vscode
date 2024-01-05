import * as vscode from "vscode";

export function getLogCallsPath() {
  return vscode.workspace
    .getConfiguration("git-branchless")
    .get<string>("logCallsToPath");
}
