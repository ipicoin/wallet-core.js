/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/

import { ChainRegistryClient } from "@chain-registry/client";

import Controller from "./_controller.mjs";

class ChainController extends Controller {
	get client() {
		return new ChainRegistryClient({
			chainNames: Controller.ConfigController.chains,
		});
	}
}

export default ChainController;
