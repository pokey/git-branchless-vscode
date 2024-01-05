import * as vscode from "vscode";
import { ExecutorImpl } from "./ExecutorImpl";
import Git from "./Git";
import { GitExecutorImpl } from "./GitExecutorImpl";
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
    new GitExecutorImpl(
      new TerminalImpl(workspaceFolder),
      new ExecutorImpl(workspaceFolder)
    )
  );
}
