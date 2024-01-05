import { Executor } from "./Executor";
import { logCall } from "./logCall";

export class SpyExecutor implements Executor {
  constructor(private wrapped: Executor, private logPath: string) {}

  async exec(command: string, args: string[]): Promise<string> {
    const result = await this.wrapped.exec(command, args);

    await logCall(this.logPath, {
      name: "Executor.exec",
      args: [command, args],
      result,
    });

    return result;
  }

  async execCheck(command: string, args: string[]): Promise<boolean> {
    const result = await this.wrapped.execCheck(command, args);

    await logCall(this.logPath, {
      name: "Executor.execCheck",
      args: [command, args],
      result,
    });

    return result;
  }
}
