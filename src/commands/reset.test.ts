import { commandTest } from "../testUtil/commandTest";
import reset from "./reset";

suite("reset", () => {
  test(
    "basic",
    commandTest(
      async (git) => {
        await reset.run({
          git,
          source: ".",
          destination: "ancestors.nth(roots(range(., .)), 1)",
          type: "mixed",
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
          args: ["git", ["diff", "--quiet"]],
          result: true,
        },
        {
          name: "Executor.exec",
          args: ["git-branchless", ["query", "-r", "."]],
          result: "ea6cdcaadbe2f3a3160417b1415fc421123fde41\n",
        },
        {
          name: "Executor.exec",
          args: [
            "git",
            [
              "show",
              "--no-patch",
              "--format=%H%x00%an%x00%cI%x00%s%x00%D",
              "ea6cdcaadbe2f3a3160417b1415fc421123fde41",
            ],
          ],
          result:
            "ea6cdcaadbe2f3a3160417b1415fc421123fde41\u0000Pokey Rule\u00002024-01-05T13:37:03+00:00\u0000blah blah\u0000HEAD -> pokey/blah-blah\n",
        },
        {
          name: "Executor.exec",
          args: [
            "git-branchless",
            ["query", "-r", "ancestors.nth(roots(range(., .)), 1)"],
          ],
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
          name: "Executor.exec",
          args: [
            "git",
            ["checkout", "ea6cdcaadbe2f3a3160417b1415fc421123fde41"],
          ],
          result: "",
        },
        {
          name: "Executor.exec",
          args: [
            "git",
            ["reset", "--mixed", "e6b242c566f9917a5da9b8421743e86840065c22"],
          ],
          result: "",
        },
        {
          name: "Terminal.runCommand",
          args: ["git-branchless smartlog", false],
        },
      ]
    )
  );
});
