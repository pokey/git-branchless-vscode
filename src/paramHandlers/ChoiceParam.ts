import * as vscode from "vscode";
import { z } from "zod";
import { CommandParam } from "../CommandDescription.types";
import UserCanceledError from "./UserCanceledError";

export default class ChoiceParam<T extends string> implements CommandParam<T> {
  schema = z.enum(this.choices);

  constructor(private message: string, private choices: [T, ...T[]]) {
    this.handleMissing = this.handleMissing.bind(this);
  }

  async handleMissing(): Promise<T> {
    const value = (await vscode.window.showQuickPick(this.choices, {
      title: this.message,
    })) as T | undefined;

    if (value == null) {
      throw new UserCanceledError();
    }

    return value;
  }
}
