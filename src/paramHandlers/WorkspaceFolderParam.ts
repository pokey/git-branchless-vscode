import * as vscode from "vscode";
import { z } from "zod";
import { CommandParam } from "../CommandDescription.types";
import UserCanceledError from "./UserCanceledError";

export default class WorkspaceFolderParam
  implements CommandParam<string, vscode.WorkspaceFolder>
{
  schema = z.string();

  constructor() {
    this.handleMissing = this.handleMissing.bind(this);
    this.transform = this.transform.bind(this);
  }

  async transform(raw: string): Promise<vscode.WorkspaceFolder> {
    const { workspaceFolders } = vscode.workspace;

    if (workspaceFolders == null) {
      throw new Error("Must have a workspace.");
    }

    if (raw === "auto") {
      if (workspaceFolders == null || workspaceFolders.length !== 1) {
        throw new Error(
          "Only single-folder workspaces currently supported with 'auto' for now."
        );
      }

      return workspaceFolders[0];
    }

    const ret = workspaceFolders.find(({ name }) => raw === name);

    if (ret == null) {
      throw new Error(`Couldn't find workspace ${raw}`);
    }

    return ret;
  }

  async handleMissing(): Promise<vscode.WorkspaceFolder> {
    const { workspaceFolders } = vscode.workspace;

    if (workspaceFolders == null) {
      throw new Error("Must have a workspace.");
    }

    if (workspaceFolders.length === 1) {
      return workspaceFolders[0];
    }

    const value = await vscode.window.showWorkspaceFolderPick();

    if (value == null) {
      throw new UserCanceledError();
    }

    return value;
  }
}
