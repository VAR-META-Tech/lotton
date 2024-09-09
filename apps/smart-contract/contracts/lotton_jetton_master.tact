import "@stdlib/deploy";
import "./imports/jetton/JettonMaster.tact";
import "./imports/jetton/JettonWallet.tact";
import "./lotton_jetton_wallet.tact";

contract LottonJettonMaster with JettonMaster, Deployable {
    total_supply: Int as coins;
    owner: Address;
    jetton_content: Cell;
    mintable: Bool;

    init(owner: Address, content: Cell){
        self.total_supply = 1000000;
        self.owner = owner;
        self.mintable = true;
        self.jetton_content = content;
    }

    override inline fun calculate_jetton_wallet_init(owner_address: Address): StateInit {
        return initOf LottonJettonWallet(owner_address, myAddress());
    }
}