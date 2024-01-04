import * as vscode from "vscode";
import Git from "./Git";
import GitExecutor from "./GitExecutor";
import { ExecutorImpl } from "./ExecutorImpl";
import { TerminalImpl } from "./TerminalImpl";

const gits: Record<string, Git> = {};

export function getWorkspaceGit(workspaceFolder: vscode.WorkspaceFolder) {
  const uriString = workspaceFolder.uri.toString();
  let git = gits[uriString];

  if (git != null) {
    return git;
  }

  git = constructWorkspaceGit(workspaceFolder);

  gits[uriString] = git;

  return git;
}

function constructWorkspaceGit(workspaceFolder: vscode.WorkspaceFolder) {
  return new Git(
    new GitExecutor(
      new TerminalImpl(workspaceFolder),
      new ExecutorImpl(workspaceFolder)
    )
  );
}
