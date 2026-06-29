import BasicController from "./_controller.mjs";
import ChainControll from "./chain-controller.mjs";
import grpcClientControll from "./grpc-client-controll.mjs";
import rpcClientControll from "./rpc-client-controll.mjs";
import SignerControll from "./signer-controll.mjs";

export default Object.assign(BasicController, {
	rpcClientControll,
	grpcClientControll,
	SignerControll,
	ChainControll,
});
