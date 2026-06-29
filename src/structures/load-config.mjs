/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/
import { cosmiconfigSync } from "cosmiconfig";

function loadConfigData() {
	return cosmiconfigSync("wallet-core").search();
}

export default loadConfigData();
