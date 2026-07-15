import { expect, test } from "vitest";

import CoreModels from "../../src/models/_core.mjs";

test("requires an explicit chain configuration", () => {
	expect(() => CoreModels.configure()).toThrowError(
		"A chain configuration object is required",
	);
});

test("exposes validated chain configuration and presets", () => {
	const chain = {
		chainId: "ipi-test-1",
		chainName: "IPI Test",
		bech32Config: { bech32PrefixAccAddr: "ipi" },
		currencies: [],
	};
	const presets = { endpointPolicy: "test-only" };

	CoreModels.configure({ chain, presets });

	expect(CoreModels.CHAIN).toBe(chain);
	expect(CoreModels.CHAIN_ID).toBe("ipi-test-1");
	expect(CoreModels.CHAIN_NAME).toBe("IPI Test");
	expect(CoreModels.PRESETS).toBe(presets);
});
