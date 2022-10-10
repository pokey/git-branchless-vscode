import * as vscode from "vscode";
import { z } from "zod";
import { CommandParam } from "../CommandDescription.types";
import UserCanceledError from "./UserCanceledError";

export default class RevsetParam implements CommandParam<string> {
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
