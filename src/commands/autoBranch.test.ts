import { commandTest } from "../testUtil/commandTest";
import autoBranch from "./autoBranch";

suite("autoBranch", () => {
  test(
    "basic",
    commandTest(
      async (git) => {
        await autoBranch.run({ git, revset: "stack(.)", prefix: "pokey/" });
      },
      [
        {
          name: "Executor.exec",
          args: ["git", ["rev-parse", "--git-common-dir"]],
          result: ".git\n",
        },
        {
          name: "Executor.exec",
          args: ["git-branchless", ["query", "-r", "(stack(.)) - branches()"]],
          result:
            "74833c30bff7708dea03085cd16d132b982296b8\nea6cdcaadbe2f3a3160417b1415fc421123fde41\n",
        },
        {
          name: "Executor.exec",
          args: [
            "git",
            [
              "show",
              "--no-patch",
              "--format=%H%x00%an%x00%cI%x00%s%x00%D",
              "74833c30bff7708dea03085cd16d132b982296b8",
              "ea6cdcaadbe2f3a3160417b1415fc421123fde41",
            ],
          ],
          result:
            "74833c30bff7708dea03085cd16d132b982296b8\u0000Pokey Rule\u00002024-01-05T13:31:41+00:00\u0000Even more stuff\u0000\nea6cdcaadbe2f3a3160417b1415fc421123fde41\u0000Pokey Rule\u00002024-01-05T13:37:03+00:00\u0000blah blah\u0000HEAD\n",
        },
        {
          name: "Executor.exec",
          args: [
            "git",
            [
              "branch",
              "pokey/even-more-stuff",
              "74833c30bff7708dea03085cd16d132b982296b8",
            ],
          ],
          result: "",
        },
        {
          name: "Executor.exec",
          args: [
            "git",
            [
              "branch",
              "pokey/blah-blah",
              "ea6cdcaadbe2f3a3160417b1415fc421123fde41",
            ],
          ],
          result: "",
        },
        {
          name: "Executor.exec",
          args: ["git", ["switch", "pokey/blah-blah"]],
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
