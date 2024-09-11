import { Address, beginCell, Dictionary, toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { mnemonicToWalletKey, sign } from '@ton/crypto';

async function setPublicKey(lottery: any, provider: any) {
    await lottery.send(
        provider.sender(), {
            value: toNano('0.06'),
        },
        {
            $$type: 'SetPublicKey',
            publicKey: 35697107194817367972172360094398639751774068753154718602415145470517477976469n
        }
    );
}

async function setAdmin(lottery: any, provider: any) {
    await lottery.send(
        provider.sender(), {
            value: toNano('0.05'),
        },
        {
            $$type: 'SetAdmin',
            admin: Address.parse('0QBmPzFlJnqlNaHV22V6midanLx7ch9yRBiUnv6sH8aMfIcP'),
            active: true
        }
    );
}

async function createPool(lottery: any, provider: any) {
    const now = Math.floor(Date.now()/1000);
    let prizes: Dictionary<number, number> = Dictionary.empty(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8));
    prizes.set(1, 10);
    prizes.set(2, 15);
    prizes.set(3, 20);
    prizes.set(4, 25);

    await lottery.send(
        provider.sender(), {
            value: toNano('0.05'),
        },
        {
            $$type: 'CreatePool',
            ticketPrice: toNano(1),
            initialRounds: 1n,
            startTime: BigInt(now),
            endTime: BigInt(now) + BigInt(40),
            active: true,
            sequence: BigInt(3600 * 24),
            jettonWallet: Address.parse('EQDw0Uwf9kK-_AlMOJV7sgmYSX86tAD83q9R8LKc-UMy1DfT'),
            prizes: prizes
        }
    );
}
export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const address = Address.parse('EQCtdn4Gd6v3gnm5uGZiirV-90Xd3KdLDXVZuK1q8Po4ehbW');
    const lottery = provider.open(Lottery.fromAddress(address));


    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    let poolId = 1n;
    let roundId = 1n;

    await setAdmin(lottery, provider);
    await setPublicKey(lottery, provider);

    //await createPool(lottery, provider);

    await sleep(20000);
    let pools = await lottery.getCurrentPool();
    let attempt = 1;

    console.log('pools', pools);
    console.log('Prizes: ', pools.get(1n)?.prizes);
    while (poolId) {
        ui.setActionPrompt(`Attempt ${attempt}: `);
        let pool = await lottery.getPoolById(poolId);
        console.log('pool', pool);
        let round = await lottery.getRoundById(poolId, roundId);
        console.log('round', round);
        if (round?.roundId) {
            await lottery.send(
                provider.sender(), {
                    value: toNano('1.5'),
                },
                {
                    $$type: 'BuyTicket',
                    poolId: poolId,
                    roundId: roundId,
                    quantity: 1n
                }
            );
            console.log('Waiting for user ticket...');
            await sleep(20000);
            console.log('Address: ', provider.sender().address!!);
            let userTicket = await lottery.getUsersTicket(poolId, roundId);
            await lottery.getPublicKey();
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
                    poolId: poolId,
                    roundId: roundId,
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
                },
                {
                    $$type: 'Claim',
                    poolId: poolId,
                    roundId: roundId,
                    amount: airDropAmount,
                    receiver: provider.sender().address!!,
                    signature: signatureCell
                }
            )
            await sleep(20000);
            console.log('claim', claim);

            let userClaim = await lottery.getClaimData(poolId, roundId);
            console.log('userClaim', userClaim);
            let isClaimed = await lottery.getIsClaim(poolId, roundId, provider.sender().address!!);
            console.log('isClaimed', isClaimed);
        }
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
