import { CommandDescription } from "../CommandDescription.types";
import getTerminal from "../getTerminal";
import { RevsetParam, WorkspaceFolderParam } from "../paramHandlers";
import exec from "../exec";
import getOutputChannel from "../getOutputChannel";

const params = {
  revset: new RevsetParam(
    "A revset specifying the commits to add branch names to"
  ),
  workspaceFolder: new WorkspaceFolderParam(),
};

const autoBranch: CommandDescription<typeof params> = {
  id: "custom.autoBranch",
  params,
  async run({ revset, workspaceFolder }) {
    const { stdout, stderr } = await exec(
      `git-branchless query -r '${revset} - branches()'`,
      {
        cwd: workspaceFolder.uri.fsPath,
      }
    );

    if (stderr && stderr.length > 0) {
      getOutputChannel().appendLine(stderr);
      getOutputChannel().show(true);
    }
    const terminal = getTerminal(workspaceFolder);

    const lines = stdout.split(/\r{0,1}\n/);
    for (const line of lines) {
      if (line.length === 0) {
        continue;
      }
      terminal.runCommand(`echo Commit ${line}`, false);
    }
  },
};

export default autoBranch;
