import { commandTest } from "../testUtil/commandTest";
import detachHead from "./detachHead";

suite("detachHead", () => {
  test(
    "basic",
    commandTest(
      async (git) => {
        await detachHead.run({
          git,
        });
      },
      [
        {
          name: "Executor.exec",
          args: ["git", ["checkout", "--detach", "head"]],
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
