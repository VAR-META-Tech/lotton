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
    const now = Math.floor(Date.now()/1000);

    await lottery.send(
        provider.sender(), {
            value: toNano('0.05'),
        },
        {
            $$type: 'PoolCreated',
            ticketPrice: 1n,
            initialRounds: 1n,
            startTime: BigInt(now),
            endTime: BigInt(now) + BigInt(60 * 60 * 24 * 7),
            active: true,
        }
    );

    ui.write('Waiting for counter to increase...');
    await sleep(20000);
    let poolId = await lottery.getCurrentPool();
    let attempt = 1;
    console.log('poolId', poolId);
    while (poolId) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        let pool = await lottery.getPoolById(poolId);
        console.log('pool', pool);
        let round = await lottery.getCurrentRound();
        console.log('round', round);
        if (round?.roundId) {
            await lottery.send(
                provider.sender(), {
                    value: toNano('1.5'),
                },
                {
                    $$type: 'BuyTicket',
                    poolId: round?.poolId,
                    roundId: round?.roundId,
                    quantity: 1n
                }
            );
            console.log('Waiting for user ticket...');
            await sleep(20000);
            console.log('Address: ', provider.sender().address!!);
            let userTicket = await lottery.getUsersTicket();
            let attempt2 = 1;
            console.log('userTicket', userTicket);
            let userTicketNumber = await lottery.getUserTicketByAddress(provider.sender().address!!);
            console.log('userTicketNumber', userTicketNumber);
            while (!userTicket) {
                ui.setActionPrompt(`Attempt ${attempt}.${attempt2}`);
                await sleep(10000);
                userTicket = await lottery.getUsersTicket();
                attempt2++;
            }
        }
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
