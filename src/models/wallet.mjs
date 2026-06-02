import fs from "node:fs"
import { URL } from "node:url"
import path from "node:path"

// becoming to be shaped under outlines of some concept of usage logics, yet it still do nothing spectacular

class Wallet{
    getBallance(){

    }
    readAddress(){

    }
    saveKeyfile(keyPath){

        return 
    }
    loadKeyfile(){

    }
    loadMnemonic(){

    }
    constructor(){

    }
    sendTransmission(){

    }
    listTransmissions(){

    }
    listReceivings(){
        
    }
    static load(keypath){
        return new Wallet()
    }
    static save(walletitem, keypath){
        return keypath
    }
    static create(){
        return new Wallet()
    }
}

export default Wallet