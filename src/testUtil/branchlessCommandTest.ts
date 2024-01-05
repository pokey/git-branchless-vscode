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
      exec: Sinon.fake(),
      execCheck: Sinon.fake.resolves(true),
    };
    const git = new Git(new GitExecutorImpl(terminal, executor));

    await run(git);

    Sinon.assert.calledOnceWithExactly(
      terminal.runCommand,
      expectedCommand,
      noConfirmation
    );
  };
}
