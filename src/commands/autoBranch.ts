import { CommandDescription } from "../CommandDescription.types";
import { RevsetParam, WorkspaceFolderParam } from "../paramHandlers";

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
    console.log(`revset: ${revset}`);
    console.log(`workspaceFolder: ${workspaceFolder.uri.toString()}`);
  },
};

export default autoBranch;
