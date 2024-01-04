export interface Terminal {
  /**
   * Run the command in the terminal.
   * @param command The command to run
   * @param requireConfirmation Whether to ask user for confirmation before running the command
   */
  runCommand(command: string, requireConfirmation: boolean): Promise<void>;
}
