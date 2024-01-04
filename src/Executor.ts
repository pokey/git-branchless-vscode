
export interface Executor {
  exec(command: string, args: string[]): Promise<string>;
  execCheck(command: string, args: string[]): Promise<boolean>;
}
