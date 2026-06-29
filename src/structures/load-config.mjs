/*

*/

import { cosmiconfigSync } from "cosmiconfig";

function loadConfigData() {
	return cosmiconfigSync("wallet-core").search();
}

export default loadConfigData();
