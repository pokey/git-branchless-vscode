import * as vscode from "vscode";
import { ExecutorImpl } from "./ExecutorImpl";
import Git from "./Git";
import { GitExecutorImpl } from "./GitExecutorImpl";
import { TerminalImpl } from "./TerminalImpl";
import { SpyExecutor } from "./SpyExecutor";
import { Executor } from "./Executor";
import { Terminal } from "./Terminal";
import { SpyTerminal } from "./SpyTerminal";

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
  const logCallsToPath = vscode.workspace
    .getConfiguration("git-branchless")
    .get<string>("logCallsToPath");

  if (logCallsToPath != null) {
    terminal = new SpyTerminal(terminal, logCallsToPath);
    executor = new SpyExecutor(executor, logCallsToPath);
  }

  return new Git(new GitExecutorImpl(terminal, executor));
}
