import Git from "../Git";
import branchlessSmartlog from "./branchlessSmartlog";
import Sinon = require("sinon");

suite("branchlessSmartlog", () => {
  test("basic", basic);
});

async function basic() {
  const dummyFake = Sinon.fake();

  const gitExecutor = {
    runBranchlessCmdInTerminalAdvanced: Sinon.fake.returns(Promise.resolve()),
    runGitCmd: dummyFake,
    runGitCmdCheck: dummyFake,
    runBranchlessCmd: dummyFake,
    runBranchlessCmdInTerminal: dummyFake,
  };
  const git = new Git(gitExecutor);
  await branchlessSmartlog.run({ git, noConfirmation: true });
  Sinon.assert.calledOnceWithExactly(
    gitExecutor.runBranchlessCmdInTerminalAdvanced,
    "smartlog",
    {
      dangerousRawArgString: "",
      logAfter: false,
      noConfirmation: true,
    }
  );
  Sinon.assert.notCalled(dummyFake);
}
