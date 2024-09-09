import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { LottonJettonWallet } from '../wrappers/LottonJettonWallet';
import '@ton/test-utils';

describe('LottonJettonWallet', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let lottonJettonWallet: SandboxContract<LottonJettonWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        lottonJettonWallet = blockchain.openContract(await LottonJettonWallet.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await lottonJettonWallet.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: lottonJettonWallet.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and lottonJettonWallet are ready to use
    });
});
