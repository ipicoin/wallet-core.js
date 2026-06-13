/*
    wallet-core v0.1.1 - https://github.com/ipicoin/wallet-core.js
  Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

  for further growth and evolution of IPI DAO (https://ipi.io/) 

  disclaimer of trademark copyrights branding notice statement: 
  - https://github.com/ipicoin/.github/blob/ac7d86625f46ef3e53aeea51931b96ea75ed87be/statements/BRANDING_NOTICE.md
*/

import repl from "node:repl";
import WalletCore from "./index.mjs";

console.log(
	" # under `IPI` there is assigned wallet-core as imported package to play in cli",
);

const cliPromptCursor =
	" (\x1b[33mWALLET-CORE\x1b[0m::\x1b[34mCLI_REPL\x1b[0m)> "; // " (WALLET-CORE::CLI_REPL)> "

const CLI = repl.start(cliPromptCursor);

CLI.context.IPI = WalletCore;

// missleading main pointer in package.json, looks like it should be replaced with index.mjs
// this file can act as REPL UI/CLI executible program handler script
