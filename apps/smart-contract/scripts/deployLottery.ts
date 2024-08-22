import { toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const lottery = provider.open(await Lottery.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await lottery.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(lottery.address);

    console.log('ID', await lottery.getId());
}
