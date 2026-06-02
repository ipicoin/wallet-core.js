/*
    wallet-core v0.1.1 - https://github.com/ipicoin/wallet-core.js
  Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

  for further growth and evolution of IPI DAO (https://ipi.io/) 

  disclaimer of trademark copyrights branding notice statement: 
  - https://github.com/ipicoin/.github/blob/ac7d86625f46ef3e53aeea51931b96ea75ed87be/statements/BRANDING_NOTICE.md
*/
import Address from "./address.mjs"
import Wallet from "./wallet.mjs"
import Contract from "./contract.mjs"
import Request from "./request.mjs"
import Transaction from "./transaction.mjs"

export default class IPI_Models{ // IPI_models as base for rest of them
    /*
    this class shall provide extensible base for all model classes
    that should make it verification root parrent shared 
    across package beside containing unit that 
    allows access to all classes 
    */
    static check(instance, checkname){
        switch(checkname){
            case "is-wallet":
            return instance instanceof Wallet
            // break;
            case "is-address":
            return instance instanceof Address
            // break;
            case "is-contract":
            return instance instanceof Contract
            // break;
            case "is-transaction":
            return instance instanceof Transaction
            // break;
            case "is-request":
            return instance instanceof Request
            // break;
            default:
            throw TypeError("not valid type of model")
        }
    }
    static get Address(){
        return Address
    }
    static get Wallet(){
        return Wallet
    }
    static get Contract(){
        return Contract
    }
    static get Request(){
        return Request
    }
    static get Transaction(){
        return Transaction
    }
}