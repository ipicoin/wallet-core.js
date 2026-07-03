/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/

import { cosmiconfigSync } from "cosmiconfig";

import Controller from "./_controller.mjs";

class ConfigController extends Controller {
	loadConfigData() {
		return cosmiconfigSync("wallet-core").search();
	}
}

export default ConfigController;
