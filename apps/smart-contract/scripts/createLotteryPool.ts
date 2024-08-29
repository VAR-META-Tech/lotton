import { Address, beginCell, toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    // const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Lottery address'));
    const address = Address.parse('EQDwUdPrCfsUurCsD1kxxk5UFS-kUWXzhhLTkqj3y3ZXmJHq');

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const lottery = provider.open(Lottery.fromAddress(address));
    const now = Math.floor(Date.now()/1000);

    // await lottery.send(
    //     provider.sender(), {
    //         value: toNano('0.05'),
    //     },
    //     {
    //         $$type: 'SetAdmin',
    //         admin: Address.parse('0QBmPzFlJnqlNaHV22V6midanLx7ch9yRBiUnv6sH8aMfIcP'),
    //     }
    // );

    await lottery.send(
        provider.sender(), {
            value: toNano('0.05'),
        },
        {
            $$type: 'CreatePool',
            ticketPrice: 1n,
            initialRounds: 1n,
            startTime: BigInt(now),
            endTime: BigInt(now) + BigInt(60 * 60 * 24 * 7),
            active: true,
            sequence: BigInt(3600 * 24),
            jettonWallet: Address.parse('EQDw0Uwf9kK-_AlMOJV7sgmYSX86tAD83q9R8LKc-UMy1DfT'),
        }
    );

    ui.write('Waiting for counter to increase...');
    await sleep(20000);
    let pools = await lottery.getCurrentPool();
    let attempt = 1;
    let poolId = 1n;
    console.log('pools', pools);
    while (poolId) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        let pool = await lottery.getPoolById(poolId);
        console.log('pool', pool);
        let round = await lottery.getRoundById(1n, 1n);
        console.log('round', round);
        if (round?.roundId) {
            await lottery.send(
                provider.sender(), {
                    value: toNano('1.5'),
                },
                {
                    $$type: 'BuyTicket',
                    poolId: 1n,
                    roundId: 1n,
                    quantity: 1n
                }
            );
            console.log('Waiting for user ticket...');
            await sleep(20000);
            console.log('Address: ', provider.sender().address!!);
            let userTicket = await lottery.getUsersTicket(1n, 1n);
            let attempt2 = 1;
            let x = await lottery.getPublicKey();
            console.log('publicKey', x);
            console.log('userTicket', userTicket);
            let userTicketNumber = await lottery.getUserTicketByAddress(round?.poolId, round?.roundId, provider.sender().address!!);
            console.log('userTicketNumber', userTicketNumber);

            // draw lottery
            await lottery.send(
                provider.sender(), {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'DrawWinningNumbers',
                    poolId: 1n,
                    roundId: 1n,
                    latestTxHash: '0x1234567890',
                }
            );

            console.log('Waiting for winner...');
            await sleep(20000);
            let result = await lottery.getResultByPool(round?.poolId);

            // let claim = await lottery.send(
            //     provider.sender(), {
            //         value: toNano('0.05'),
            //     },
            //     {
            //         $$type: 'Claim',
            //         poolId: 1n,
            //         roundId: 1n,
            //         amount: 1n,
            //         signature: beginCell().storeBuffer().endCell()
            //     }
            // )
            console.log('result', result);
        }
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
