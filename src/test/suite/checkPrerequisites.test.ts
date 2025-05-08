import assert = require("assert");
import Git from "../../Git";
import { GitExecutorImpl } from "../../GitExecutorImpl";
import branchlessSmartlog from "../../commands/branchlessSmartlog";
import Sinon = require("sinon");

suite("Check prerequisites", () => {
  test("no git", noGit);
  test("no git repo", noGitRepo);
  test("no git branchless", noGitBranchless);
  test("no git branchless init", noGitBranchlessInit);
  test("prerequisites satisfied", prerequisitesSatisfied);
});

async function noGit() {
  const terminal = {
    runCommand: Sinon.fake(),
  };
  const executor = {
    exec: Sinon.fake(),
    execCheck: Sinon.fake.resolves(false),
  };
  const git = new Git(new GitExecutorImpl(terminal, executor));

  await assert.rejects(
    () => branchlessSmartlog.run({ git, noConfirmation: true }),
    { message: "Git not found. Please install git." }
  );
  Sinon.assert.calledOnceWithExactly(executor.execCheck, "git", ["--version"]);
  Sinon.assert.notCalled(executor.exec);
  Sinon.assert.notCalled(terminal.runCommand);
}

async function noGitRepo() {
  const terminal = {
    runCommand: Sinon.fake(),
  };
  const executor = {
    exec: Sinon.fake(),
    execCheck: Sinon.stub()
      .onFirstCall()
      .resolves(true)
      .onSecondCall()
      .resolves(false),
  };
  const git = new Git(new GitExecutorImpl(terminal, executor));

  await assert.rejects(
    () => branchlessSmartlog.run({ git, noConfirmation: true }),
    { message: "Not currently in a git repo" }
  );
  Sinon.assert.calledTwice(executor.execCheck);
  Sinon.assert.calledWithExactly(executor.execCheck.secondCall, "git", [
    "rev-parse",
    "--is-inside-work-tree",
  ]);
  Sinon.assert.notCalled(executor.exec);
  Sinon.assert.notCalled(terminal.runCommand);
}

async function noGitBranchless() {
  const terminal = {
    runCommand: Sinon.fake(),
  };
  const executor = {
    exec: Sinon.fake(),
    execCheck: Sinon.stub()
      .onFirstCall()
      .resolves(true)
      .onSecondCall()
      .resolves(true)
      .onThirdCall()
      .resolves(false),
  };
  const git = new Git(new GitExecutorImpl(terminal, executor));

  await assert.rejects(
    () => branchlessSmartlog.run({ git, noConfirmation: true }),
    { message: "Branchless not found" }
  );

  Sinon.assert.calledThrice(executor.execCheck);
  Sinon.assert.calledWithExactly(
    executor.execCheck.thirdCall,
    "git-branchless",
    ["--version"]
  );
  Sinon.assert.notCalled(executor.exec);
  Sinon.assert.notCalled(terminal.runCommand);
}

async function noGitBranchlessInit() {
  const terminal = {
    runCommand: Sinon.fake(),
  };
  const executor = {
    exec: Sinon.fake.resolves(".git"),
    execCheck: Sinon.stub()
      .onFirstCall()
      .resolves(true)
      .onSecondCall()
      .resolves(true)
      .onThirdCall()
      .resolves(true)
      .onCall(3)
      .resolves(false),
  };
  const git = new Git(new GitExecutorImpl(terminal, executor));

  await assert.rejects(
    () => branchlessSmartlog.run({ git, noConfirmation: true }),
    { message: "Branchless not initialized in repo" }
  );

  Sinon.assert.callCount(executor.execCheck, 4);
  Sinon.assert.calledWithExactly(executor.execCheck.getCalls()[3], "stat", [
    ".git/branchless/config",
  ]);
  Sinon.assert.calledOnce(executor.exec);
  Sinon.assert.notCalled(terminal.runCommand);
}

async function prerequisitesSatisfied() {
  const terminal = {
    runCommand: Sinon.fake(),
  };
  const executor = {
    exec: Sinon.fake.resolves(".git"),
    execCheck: Sinon.fake.resolves(true),
  };
  const git = new Git(new GitExecutorImpl(terminal, executor));

  await branchlessSmartlog.run({ git, noConfirmation: true });

  Sinon.assert.callCount(executor.execCheck, 4);
  Sinon.assert.calledOnce(executor.exec);
  Sinon.assert.calledOnceWithExactly(
    terminal.runCommand,
    "git-branchless smartlog",
    false
  );

  // Check that it caches whether the prerequisites are satisfied
  executor.execCheck.resetHistory();
  terminal.runCommand.resetHistory();
  executor.exec.resetHistory();

  await branchlessSmartlog.run({ git, noConfirmation: true });

  Sinon.assert.notCalled(executor.execCheck);
  Sinon.assert.notCalled(executor.exec);
  Sinon.assert.calledOnceWithExactly(
    terminal.runCommand,
    "git-branchless smartlog",
    false
  );
}
