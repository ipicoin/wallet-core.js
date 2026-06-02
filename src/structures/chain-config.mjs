import { cosmiconfigSync } from "cosmiconfig";

function chainConfig(){
    return cosmiconfigSync("ipi-wallet-core");
}

export default chainConfig()