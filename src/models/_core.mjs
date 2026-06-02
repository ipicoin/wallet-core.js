import { EventEmitter } from 'node:events';
import chainConfig from "../structures/chain-config.mjs"

class CoreModels extends EventEmitter{ // IPI_models as base for rest of them
    static get CHAIN(){
        return chainConfig
    }
    constructor(){
    
    super()
  }
}

export default CoreModels