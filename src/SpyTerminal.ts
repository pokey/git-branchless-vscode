import { Terminal } from "./Terminal";
import { logCall } from "./logCall";

export class SpyTerminal implements Terminal {
  constructor(private wrapped: Terminal, private logPath: string) {}

  async runCommand(
    command: string,
    requireConfirmation: boolean
  ): Promise<void> {
    const result = await this.wrapped.runCommand(command, requireConfirmation);

    await logCall(this.logPath, {
      name: "Terminal.runCommand",
      args: [command, requireConfirmation],
      result,
    });

    return result;
  }
}
