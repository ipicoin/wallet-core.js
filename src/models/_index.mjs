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