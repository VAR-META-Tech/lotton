import "@stdlib/deploy";
import "./imports/jetton/JettonMaster.tact";
import "./imports/jetton/JettonWallet.tact";

contract LottonJettonWallet with JettonWallet, Deployable {
    balance: Int as coins = 0;
    owner: Address;
    jetton_master: Address;

    init(owner: Address, jetton_master: Address) {
        self.owner = owner;
        self.jetton_master = jetton_master;
    }

    override inline fun calculate_jetton_wallet_init(owner_address: Address): StateInit {
        return initOf LottonJettonWallet(owner_address, self.jetton_master);
    }
}
