/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/

import { expect, test } from "vitest";
import f from "../../src/structures/load-config.mjs";

test("...", () => {
	expect(f).toBeInstanceOf(Object);
});

// test("...", () => {
//     //console.log(f.search())
// 	expect(f.search()).toBeInstanceOf(Object);
// });

test("...", () => {
	//console.log(f.search().config)
	expect(f.config).toBeInstanceOf(Object);
});

test("...", () => {
	//console.log(f.search().config.chain)
	expect(f.config.chain).toBeInstanceOf(Object);
});

// test("...", () => {
// 	//console.log(f.search().config.chain.chainId)
// 	expect(f.config).toBe("testing");
// });

//console.log(chainConfiguration)

test("...", () => {
	expect(chainConfiguration).toBeInstanceOf(Object);
});
