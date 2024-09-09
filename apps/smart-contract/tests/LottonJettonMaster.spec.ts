import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { LottonJettonMaster } from '../wrappers/LottonJettonMaster';
import '@ton/test-utils';

describe('LottonJettonMaster', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let lottonJettonMaster: SandboxContract<LottonJettonMaster>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        lottonJettonMaster = blockchain.openContract(await LottonJettonMaster.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await lottonJettonMaster.send(
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
            to: lottonJettonMaster.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and lottonJettonMaster are ready to use
    });
});
