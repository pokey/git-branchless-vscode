import { InferBranchlessArgType } from "../BranchlessCommand";
import { branchlessCommandTest } from "../testUtil/branchlessCommandTest";
import branchlessMoveExact, {
  branchlessMoveExactParams,
} from "./branchlessMoveExact";

type TestCase = [
  args: InferBranchlessArgType<typeof branchlessMoveExactParams>,
  expected: string
];

const testCases: TestCase[] = [
  [
    { exact: "source", destination: "dest" },
    "git-branchless move --exact 'source' --dest 'dest' && git-branchless smartlog",
  ],
  [
    { exact: "source", destination: "dest", merge: true },
    "git-branchless move --exact 'source' --dest 'dest' --merge && git-branchless smartlog",
  ],
];

suite("branchlessMoveExact", () => {
  testCases.forEach(([args, expected]) => {
    test(
      `args: ${JSON.stringify(args)}`,
      branchlessCommandTest(async (git) => {
        await branchlessMoveExact.run({ git, noConfirmation: true, ...args });
      }, expected)
    );
  });
});
