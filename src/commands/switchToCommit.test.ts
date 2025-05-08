import { commandTest } from "../testUtil/commandTest";
import switchToCommit from "./switchToCommit";

suite("switchToCommit", () => {
  test(
    "branch",
    commandTest(
      async (git) => {
        await switchToCommit.run({
          git,
          destination: '"pokey/blah-blah"',
        });
      },
      [
        {
          name: "Executor.exec",
          args: ["git", ["rev-parse", "--git-common-dir"]],
          result: ".git\n",
        },
        {
          name: "Executor.execCheck",
          args: [
            "git",
            ["show-ref", "--verify", "--quiet", "refs/heads/pokey/blah-blah"],
          ],
          result: true,
        },
        {
          name: "Terminal.runCommand",
          args: ["git-branchless switch 'pokey/blah-blah'", false],
        },
      ]
    )
  );

  test(
    "sha",
    commandTest(
      async (git) => {
        await switchToCommit.run({
          git,
          destination: '"e6b242c"',
        });
      },
      [
        {
          name: "Executor.exec",
          args: ["git", ["rev-parse", "--git-common-dir"]],
          result: ".git\n",
        },
        {
          name: "Executor.execCheck",
          args: [
            "git",
            ["show-ref", "--verify", "--quiet", "refs/heads/e6b242c"],
          ],
          result: false,
        },
        {
          name: "Executor.exec",
          args: ["git-branchless", ["query", "-r", '"e6b242c"']],
          result: "e6b242c566f9917a5da9b8421743e86840065c22\n",
        },
        {
          name: "Executor.exec",
          args: [
            "git",
            [
              "show",
              "--no-patch",
              "--format=%H%x00%an%x00%cI%x00%s%x00%D",
              "e6b242c566f9917a5da9b8421743e86840065c22",
            ],
          ],
          result:
            "e6b242c566f9917a5da9b8421743e86840065c22\u0000Pokey Rule\u00002024-01-05T13:31:57+00:00\u0000Foo bar\u0000pokey/bar\n",
        },
        {
          name: "Terminal.runCommand",
          args: [
            "git-branchless switch 'e6b242c566f9917a5da9b8421743e86840065c22'",
            false,
          ],
        },
      ]
    )
  );
});
