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
