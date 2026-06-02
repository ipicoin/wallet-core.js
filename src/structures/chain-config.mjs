import { cosmiconfigSync } from "cosmiconfig";

function chainConfig(){
    return cosmiconfigSync("chain");
}

export default chainConfig()