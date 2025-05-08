import * as vscode from "vscode";
import { GitCommandDescription } from "../CommandDescription.types";
import { CommitishParam } from "../paramHandlers";

const params = {
  commit: new CommitishParam("The commit to get the message from"),
};

const getCommitMessage: GitCommandDescription<typeof params> = {
  id: "custom.getCommitMessage",
  params,
  async run({ commit, git }) {
    try {
      // Get the actual commit hash from the input (which might be a branch, tag, etc.)
      const commitObj = await git.queryOne(commit);

      return await git.getCommitMessage(commitObj);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to get commit message: ${error}`);
      throw error;
    }
  },
};

export default getCommitMessage;
