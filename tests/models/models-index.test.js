/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/

import { expect, test } from "vitest";
import f from "../../src/models/_index.mjs";

test("...", () => {
	expect(f).toBeDefined();
});
test("...", () => {
	expect(new f.Address()).toBeInstanceOf(f);
});
test("...", () => {
	expect(new f.Wallet()).toBeInstanceOf(f);
});
test("...", () => {
	expect(new f.Request()).toBeInstanceOf(f);
});
test("...", () => {
	expect(new f.Transaction()).toBeInstanceOf(f);
});
