import { toNano } from '@ton/core';
import { LottonJettonMaster } from '../wrappers/LottonJettonMaster';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const lottonJettonMaster = provider.open(await LottonJettonMaster.fromInit());

    await lottonJettonMaster.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(lottonJettonMaster.address);

    // run methods on `lottonJettonMaster`
}
