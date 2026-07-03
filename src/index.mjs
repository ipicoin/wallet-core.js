/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/
import Models from "./models/_index.mjs";
import Operations from "./operations/_index.mjs";
import Core from "./core.mjs";
import IPI_CHAINCONFIG from "./config/ipi-chainconfig.mjs";

// Named exports — the functional core API (issue #9: keygen / HD / sign & broadcast).
export * from "./core.mjs";
// Named re-exports of the class layer.
// (Also satisfies existing `import { Models } from "../index.mjs"` in operations.)
export { Models, Operations, IPI_CHAINCONFIG };

export default {
	// here will be not just models - all usefull stuff should be passed here
	Models,
	Operations,
	Core,
	ChainConfig: IPI_CHAINCONFIG,
};
