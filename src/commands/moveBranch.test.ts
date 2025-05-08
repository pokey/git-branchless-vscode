import { commandTest } from "../testUtil/commandTest";
import moveBranch from "./moveBranch";

suite("moveBranch", () => {
  test(
    "basic",
    commandTest(
      async (git) => {
        await moveBranch.run({ git, branch: "pokey/bar", destination: "." });
      },
      [
        {
          name: "Executor.exec",
          args: ["git", ["rev-parse", "--git-common-dir"]],
          result: ".git\n",
        },
        {
          name: "Executor.exec",
          args: ["git-branchless", ["query", "-r", "."]],
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
            "e6b242c566f9917a5da9b8421743e86840065c22\u0000Pokey Rule\u00002024-01-05T13:31:57+00:00\u0000Foo bar\u0000HEAD\n",
        },
        {
          name: "Executor.exec",
          args: ["git", ["branch", "--show-current"]],
          result: "",
        },
        {
          name: "Executor.exec",
          args: [
            "git",
            [
              "branch",
              "-f",
              "pokey/bar",
              "e6b242c566f9917a5da9b8421743e86840065c22",
            ],
          ],
          result: "",
        },
        {
          name: "Executor.exec",
          args: ["git", ["switch", "pokey/bar"]],
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
