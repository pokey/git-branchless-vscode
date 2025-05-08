import { commandTest } from "../testUtil/commandTest";
import getCommitMessage from "./getCommitMessage";

suite("getCommitMessage", () => {
  test(
    "basic",
    commandTest(
      async (git) => {
        await getCommitMessage.run({
          commit: ".",
          git,
        });
      },
      [
        // These four calls are automatically stubbed to return true
        // by the commandTest function (see execCheckCounter in commandTest.ts)
        // - git --version
        // - git rev-parse --is-inside-work-tree
        // - git-branchless --version
        // - stat (for branchless config)

        // Mock the git-common-dir response
        {
          name: "Executor.exec",
          args: ["git", ["rev-parse", "--git-common-dir"]],
          result: ".git\n",
        },

        // The query call that returns commit hash for '.'
        {
          name: "Executor.exec",
          args: ["git-branchless", ["query", "-r", "."]],
          result: "74833c30bff7708dea03085cd16d132b982296b8\n",
        },
        // The git show call to get commit information
        {
          name: "Executor.exec",
          args: [
            "git",
            [
              "show",
              "--no-patch",
              "--format=%H%x00%an%x00%cI%x00%s%x00%D",
              "74833c30bff7708dea03085cd16d132b982296b8",
            ],
          ],
          result:
            "74833c30bff7708dea03085cd16d132b982296b8\u0000Test User\u00002023-01-01T00:00:00Z\u0000Test commit\u0000HEAD -> main\n",
        },
        // The git log call to get commit message
        {
          name: "Executor.exec",
          args: [
            "git",
            [
              "log",
              "-1",
              "--pretty=%B",
              "74833c30bff7708dea03085cd16d132b982296b8",
            ],
          ],
          result: "Test commit message\n",
        },
      ]
    )
  );
});
