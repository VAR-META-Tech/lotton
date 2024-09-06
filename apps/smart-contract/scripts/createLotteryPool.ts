import { Address, beginCell, Dictionary, toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { mnemonicToWalletKey, sign } from '@ton/crypto';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    // const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Lottery address'));
    const address = Address.parse('EQD828d9ATU8RJR_PfuybhvmI1VzILc0u0KUM5HTtG5v7EZT');

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
    let prizes: Dictionary<number, number> = Dictionary.empty(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8));
    prizes.set(1, 10);
    prizes.set(2, 15);
    prizes.set(3, 20);
    prizes.set(4, 25);

    await lottery.send(
        provider.sender(), {
            value: toNano('0.05'),
            bounce: true
        },
        {
            $$type: 'CreatePool',
            ticketPrice: toNano(1),
            initialRounds: 1n,
            startTime: BigInt(now),
            endTime: BigInt(now) + BigInt(60 * 60 * 24 * 7),
            active: true,
            sequence: BigInt(3600 * 24),
            jettonWallet: Address.parse('EQDw0Uwf9kK-_AlMOJV7sgmYSX86tAD83q9R8LKc-UMy1DfT'),
            prizes: prizes
        }
    );

    ui.write('Waiting for counter to increase...');
    await sleep(20000);
    let pools = await lottery.getCurrentPool();
    let attempt = 1;
    let poolId = 1n;
    console.log('pools', pools);
    console.log('Prizes: ', pools.get(1n)?.prizes);
    while (poolId) {
        ui.setActionPrompt(`Attempt ${attempt}: `);
        let pool = await lottery.getPoolById(poolId);
        console.log('pool', pool);
        let round = await lottery.getRoundById(1n, 1n);
        console.log('round', round);
        if (round?.roundId) {
            await lottery.send(
                provider.sender(), {
                    value: toNano('1.5'),
                    bounce: true
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
                    bounce: true
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
            console.log('result', result);
            //get the signature from mock server
            let airDropAmount: bigint = 1000000000n;
            const signatureData = beginCell()
                .storeInt(1, 32)
                .storeInt(1, 32)
                .storeAddress(provider.sender().address!!)
                .storeCoins(airDropAmount)
                .endCell();
            let WALLET_MNEMONIC='surround basket park setup state favorite relax document ecology into huge bring business crunch walnut arm frog rain label start fade near earn segment'

            const keyPair = await mnemonicToWalletKey(WALLET_MNEMONIC.split(" "));
            const signature = sign(signatureData.hash(), keyPair.secretKey);
            let signatureCell = beginCell().storeBuffer(signature).asSlice();
            let publicKeyBigInt = BigInt(`0x${keyPair.publicKey.toString('hex')}`);
            console.log('publicKeyBigInt', publicKeyBigInt);
            await lottery.send(
                provider.sender(), {
                    value: toNano('0.06'),
                    bounce: true
                },
                {
                    $$type: 'SetPublicKey',
                    publicKey: publicKeyBigInt
                }
            );

            await sleep(20000);

            console.log('Claiming the prize...');
            let claim = await lottery.send(
                provider.sender(), {
                    value: toNano('0.07'),
                    bounce: true
                },
                {
                    $$type: 'Claim',
                    poolId: 1n,
                    roundId: 1n,
                    amount: airDropAmount,
                    receiver: provider.sender().address!!,
                    signature: signatureCell
                }
            )
            await sleep(20000);
            console.log('claim', claim);

            let userClaim = await lottery.getClaimData(1n, 1n);
            console.log('userClaim', userClaim);
            let isClaimed = await lottery.getIsClaim(1n, 1n, provider.sender().address!!);
            console.log('isClaimed', isClaimed);
        }
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
