import * as vscode from "vscode";
import { z } from "zod";
import { CommandParam } from "./CommandDescription.types";

export class UserCanceledError extends Error {
  constructor() {
    super("User canceled input");
  }
}

export class RevsetParam implements CommandParam<string> {
  schema = z.string();

  constructor(private message: string) {
    this.handleMissing = this.handleMissing.bind(this);
  }

  async handleMissing(): Promise<string> {
    const value = await vscode.window.showInputBox({ prompt: this.message });

    if (value == null) {
      throw new UserCanceledError();
    }

    return value;
  }
}

export class CommitishParam implements CommandParam<string> {
  schema = z.string();

  constructor(private message: string) {
    this.handleMissing = this.handleMissing.bind(this);
  }

  async handleMissing(): Promise<string> {
    const value = await vscode.window.showInputBox({ prompt: this.message });

    if (value == null) {
      throw new UserCanceledError();
    }

    return value;
  }
}

export class DefaultValueParam<T> implements CommandParam<T> {
  constructor(public schema: z.ZodType<T>, public defaultValue: T) {
    this.handleMissing = this.handleMissing.bind(this);
  }

  async handleMissing(): Promise<T> {
    return this.defaultValue;
  }
}

export class WorkspaceFolderParam
  implements CommandParam<string, vscode.WorkspaceFolder>
{
  schema = z.string();

  constructor() {
    this.handleMissing = this.handleMissing.bind(this);
    this.transformer = this.transformer.bind(this);
  }

  async transformer(raw: string): Promise<vscode.WorkspaceFolder> {
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
