import { Address, toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Lottery address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const lottery = provider.open(Lottery.fromAddress(address));

    const counterBefore = await lottery.send(
        provider.sender(), {
            value: toNano('0.05'),
        },
        {
            $$type: 'PoolCreated',
            poolId:,
            token: Address.parse('0:'),
            ticketPrice: toNano('0.05'),
            startTime: 0n,
            endTime: 0n,
            active: true,
        }
    );

    // await lottery.send(
    //     provider.sender(),
    //     {
    //         value: toNano('0.05'),
    //     },
    //     {
    //         $$type: 'Add',
    //         queryId: 0n,
    //         amount: 1n,
    //     }
    // );

    ui.write('Waiting for counter to increase...');

    let counterAfter = await lottery.getCounter();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await lottery.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
