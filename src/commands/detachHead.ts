import { CommandDescription } from "../CommandDescription.types";
import Git from "../Git";
import { WorkspaceFolderParam } from "../paramHandlers";

const params = {
  workspaceFolder: new WorkspaceFolderParam(),
};

const detachHead: CommandDescription<typeof params> = {
  id: "custom.detachHead",
  params,
  async run({ workspaceFolder }) {
    await new Git(workspaceFolder).detachHead();
  },
};

export default detachHead;
