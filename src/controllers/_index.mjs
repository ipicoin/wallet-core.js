import BasicController from "./_controller.mjs";
import ChainController from "./chain-controller.mjs";
import NetclientController from "./netclient-controller.mjs";
import ConfigController from "./config-controller.mjs";

export default Object.assign(BasicController, {
	ChainController,
	NetclientController,
	ConfigController,
});
