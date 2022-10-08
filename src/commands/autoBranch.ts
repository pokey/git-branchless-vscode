import { CommandDescription } from "../CommandDescription.types";
import getCommitInfo from "../getCommitInfo";
import getTerminal from "../getTerminal";
import { RevsetParam, WorkspaceFolderParam } from "../paramHandlers";
import runBranchlessQuery from "../runBranchlessQuery";

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
    const commits = await runBranchlessQuery(`(${revset})`, workspaceFolder);
    const commitInfos = await getCommitInfo(commits, workspaceFolder);

    console.log(`commitInfos: ${JSON.stringify(commitInfos, undefined, 2)}`);

    const terminal = getTerminal(workspaceFolder);
  },
};

export default autoBranch;
