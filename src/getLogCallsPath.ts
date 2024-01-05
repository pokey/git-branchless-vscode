import * as vscode from "vscode";

/**
 * Get secret setting useful for generating test cases from real usage.
 * Note that you must reload VSCode after changing this setting.
 */
export function getLogCallsPath() {
  return vscode.workspace
    .getConfiguration("git-branchless")
    .get<string>("logCallsToPath");
}
