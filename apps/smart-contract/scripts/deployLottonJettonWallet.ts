import { toNano } from '@ton/core';
import { LottonJettonWallet } from '../wrappers/LottonJettonWallet';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const lottonJettonWallet = provider.open(await LottonJettonWallet.fromInit());

    await lottonJettonWallet.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(lottonJettonWallet.address);

    // run methods on `lottonJettonWallet`
}
