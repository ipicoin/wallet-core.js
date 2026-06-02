/*
root of imports
*/
import Wallet from "@/src/models/wallet" // replace with single IPI_MODEL
import Address from "@/src/models/address" // replace with single IPI_MODEL
import Contract from "@/src/models/contract" // replace with single IPI_MODEL
import Request from "@/src/models/request" // replace with single IPI_MODEL
import Transaction from "@/src/models/transaction" // replace with single IPI_MODEL

export default { // here will be not just models - all usefull stuff should be passed here
    Wallet, 
    Address, 
    Contract, 
    Request, 
    Transaction
}