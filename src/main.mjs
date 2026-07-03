/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/
import repl from "node:repl";
import WalletCore from "./index.mjs";

const cliPromptCursor =
	" (\x1b[33mWALLET-CORE\x1b[0m::\x1b[34mCLI_REPL\x1b[0m)> "; // " (WALLET-CORE::CLI_REPL)> "

const CLI = repl.start(cliPromptCursor);

CLI.context.IPI = WalletCore;

// missleading main pointer in package.json, looks like it should be replaced with index.mjs
// this file can act as REPL UI/CLI executible program handler script
