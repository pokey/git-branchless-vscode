import * as vscode from "vscode";
import { ExecutorImpl } from "./ExecutorImpl";
import Git from "./Git";
import { GitExecutorImpl } from "./GitExecutorImpl";
import { TerminalImpl } from "./TerminalImpl";
import { SpyExecutor } from "./SpyExecutor";
import { Executor } from "./Executor";
import { Terminal } from "./Terminal";
import { SpyTerminal } from "./SpyTerminal";
import { getLogCallsPath } from "./getLogCallsPath";

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
  let terminal: Terminal = new TerminalImpl(workspaceFolder);
  let executor: Executor = new ExecutorImpl(workspaceFolder);

  // Secret setting useful for generating test cases from real usage
  const logCallsPath = getLogCallsPath();

  if (logCallsPath != null) {
    terminal = new SpyTerminal(terminal, logCallsPath);
    executor = new SpyExecutor(executor, logCallsPath);
  }

  return new Git(new GitExecutorImpl(terminal, executor));
}
