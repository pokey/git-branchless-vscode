import { GitCommandDescription } from "../CommandDescription.types";

const params = {};

const detachHead: GitCommandDescription<typeof params> = {
  id: "custom.detachHead",
  params,
  async run({ git }) {
    await git.detachHead();
    await git.showLog();
  },
};

export default detachHead;
