import * as fs from "fs";
import * as path from "path";
import { Address, contractAddress } from "@ton/core";
import { Lottery} from "../build/Lottery/tact_Lottery"
import { prepareTactDeployment } from "@tact-lang/deployer";

(async () => {
    // Parameters
    let testnet = true;
    let packageName = "tact_Lottery.pkg";
    let admin = Address.parse('0QBmPzFlJnqlNaHV22V6midanLx7ch9yRBiUnv6sH8aMfIcP');
    let publicKey = 35697107194817367972172360094398639751774068753154718602415145470517477976469n;
    let init = await Lottery.init(admin, publicKey);

    // Load required data
    let address = contractAddress(0, init);
    let data = init.data.toBoc();
    let pkg = fs.readFileSync(path.resolve(__dirname, "../build/Lottery", packageName));

    // Prepareing
    console.log("Uploading package...");
    let prepare = await prepareTactDeployment({ pkg, data, testnet });

    // Deploying
    console.log("============================================================================================");
    console.log("Contract Address");
    console.log("============================================================================================");
    console.log();
    console.log(address.toString({ testOnly: testnet }));
    console.log();
    console.log("============================================================================================");
    console.log("Please, follow deployment link");
    console.log("============================================================================================");
    console.log();
    console.log(prepare);
    console.log();
    console.log("============================================================================================");
})();