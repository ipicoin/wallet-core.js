
import { expect, test } from "vitest";
import f from "../../src/structures/chain-config.mjs";


test("...", () => {
	expect(f).toBeInstanceOf(Object);
});

test("...", () => {
    //console.log(f.search())
	expect(f.search()).toBeInstanceOf(Object);
});

test("...", () => {
    //console.log(f.search().config)
	expect(f.search().config).toBeInstanceOf(Object);
});

test("...", () => {
    //console.log(f.search().config.chain)
	expect(f.search().config.chain).toBeInstanceOf(Object);
});

test("...", () => {
    //console.log(f.search().config.chain.chainId)
	expect(f.search().config.chain.chainId).toBe("ipi-mainnet-2");
});