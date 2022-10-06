import * as vscode from "vscode";

let _channel: vscode.OutputChannel;

export default function getOutputChannel(): vscode.OutputChannel {
  if (!_channel) {
    _channel = vscode.window.createOutputChannel("Git branchless");
  }
  return _channel;
}
