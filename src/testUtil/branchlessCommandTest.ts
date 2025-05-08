import Git from "../Git";
import { GitExecutorImpl } from "../GitExecutorImpl";
import Sinon = require("sinon");

export function branchlessCommandTest(
  run: (git: Git) => Promise<void>,
  expectedCommand: string,
  noConfirmation = false
) {
  return async () => {
    const terminal = {
      runCommand: Sinon.fake(),
    };
    const executor = {
      exec: Sinon.stub(),
      execCheck: Sinon.fake.resolves(true),
    };

    // Mock the git-common-dir response
    executor.exec
      .withArgs("git", ["rev-parse", "--git-common-dir"])
      .resolves(".git\n");

    const git = new Git(new GitExecutorImpl(terminal, executor));

    await run(git);

    Sinon.assert.calledOnceWithExactly(
      terminal.runCommand,
      expectedCommand,
      noConfirmation
    );
  };
}
