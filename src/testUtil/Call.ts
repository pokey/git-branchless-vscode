import { Executor } from "../Executor";
import { Terminal } from "../Terminal";

interface ExecutorExecCall {
  name: "Executor.exec";
  args: Parameters<Executor["exec"]>;
  result: Awaited<ReturnType<Executor["exec"]>>;
}
interface ExecutorExecCheckCall {
  name: "Executor.execCheck";
  args: Parameters<Executor["execCheck"]>;
  result: Awaited<ReturnType<Executor["execCheck"]>>;
}
interface TerminalRunCommandCall {
  name: "Terminal.runCommand";
  args: Parameters<Terminal["runCommand"]>;
}

export type Call =
  | ExecutorExecCall
  | ExecutorExecCheckCall
  | TerminalRunCommandCall;
