import { Address, toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    let admin = Address.parse('0QBmPzFlJnqlNaHV22V6midanLx7ch9yRBiUnv6sH8aMfIcP');
    let publicKey = 35697107194817367972172360094398639751774068753154718602415145470517477976469n;

    const lottery = provider.open(await Lottery.fromInit(admin, publicKey));

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

}
