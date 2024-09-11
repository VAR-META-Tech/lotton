import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, beginCell, Dictionary, toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import '@ton/test-utils';
import { mnemonicNew, mnemonicToWalletKey, sign } from '@ton/crypto';
import { sleep } from '@ton/blueprint';

describe('Lottery', () => {
    jest.setTimeout(30000)
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let lottery: SandboxContract<Lottery>;
    let provider: SandboxContract<TreasuryContract>;
    let admin: SandboxContract<TreasuryContract>;
    let mnemonic: string[]; // Mnemonic phrase
    let poolId: bigint = 1n;
    let roundId: bigint = 1n;

    /**
     * Create a pool
     */
    async function createPool() {
        let prizes: Dictionary<number, number> = Dictionary.empty(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8));
        prizes.set(1, 10);
        prizes.set(2, 15);
        prizes.set(3, 20);
        prizes.set(4, 25);

        const now = Math.floor(Date.now()/1000);

        let pool = await lottery.send(
            provider.getSender(), {
                value: toNano('1.05'),
                bounce: true
            },
            {
                $$type: 'CreatePool',
                ticketPrice: toNano(1),
                initialRounds: 5n,
                startTime: BigInt(now),
                endTime: BigInt(now) + BigInt(60 * 60 * 24 * 7),
                active: true,
                sequence: BigInt(5),
                jettonWallet: Address.parse('EQDw0Uwf9kK-_AlMOJV7sgmYSX86tAD83q9R8LKc-UMy1DfT'),
                prizes: prizes
            }
        );

        return pool;
    }

    /**
     * Set admin
     */
    async function setAdmin() {
        let owner = await lottery.getOwner();
        console.log('owner', owner);
        let admin = await lottery.send(
            deployer.getSender(), {
                value: toNano('0.05'),
            },
            {
                $$type: 'SetAdmin',
                admin: provider.address,
                active: true
            }
        );

        return admin;
    }

    /**
     * Buy ticket
     */
    async function buyTicket(user: any = provider, poolId: bigint = 1n, roundId: bigint = 1n, quantity: bigint = 1n) {
        let userTicket = await lottery.send(
            user.getSender(), {
                value: toNano('3.005'),
            },
            {
                $$type: 'BuyTicket',
                poolId: poolId,
                roundId: roundId,
                quantity: quantity
            }
        );

        return userTicket;
    }

    async function setPublicKey() {
        await lottery.send(
            deployer.getSender(), {
                value: toNano('0.06'),
            },
            {
                $$type: 'SetPublicKey',
                publicKey: 35697107194817367972172360094398639751774068753154718602415145470517477976469n
            }
        );
    }

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        provider = await blockchain.treasury('wallet');
        admin = await blockchain.treasury('admin');

        mnemonic = await mnemonicNew();
        const keyPair = await mnemonicToWalletKey(mnemonic);
        let publicKeyBigInt = BigInt(`0x${keyPair.publicKey.toString('hex')}`);

        lottery = blockchain.openContract(await Lottery.fromInit(admin.address, publicKeyBigInt));

        const deployResult = await lottery.send(
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
            to: lottery.address,
            deploy: true,
            success: true,
        });

        // Deployer Set admin
        let adminTx = await setAdmin();
        expect(adminTx.transactions).toHaveTransaction({
            from: deployer.address,
            to: lottery.address,
            success: true,
        });

        // Create pool
        let pool = await createPool();
        expect(pool.transactions).toHaveTransaction({
            from: provider.address,
            to: lottery.address,
            success: true,
        });
    });

    it('should create pool', async () => {
        let pool = await createPool();
        expect(pool.transactions).toHaveTransaction({
            from: provider.address,
            to: lottery.address,
            success: true,
        });
    });

    it('should return current pool', async () => {
        const getPool = await lottery.getCurrentPool();
        console.log('getPool', getPool);
    });

    it('should return pool ID', async () => {
        const getPool = await lottery.getPoolById(1n);
        console.log('getPool', getPool);
        expect(getPool?.poolId).toBe(1n);
    });

    it('should return user balance is enough', async () => {
        const provider = await blockchain.treasury('wallet');
        const balance = await provider.getBalance();
        console.log('balance', balance);
        expect(balance).toBeGreaterThan(1n);
    });

    it('should buy ticket', async () => {
        const provider = await blockchain.treasury('wallet');
        const balance = await provider.getBalance();
        console.log('balance', balance);
        const ticket = await buyTicket();
        const balance2 = await provider.getBalance();
        console.log('balance2', balance2);

        expect(ticket.transactions).toHaveTransaction({
            from: provider.address,
            to: lottery.address,
            success: true,
        });
    });

    it('should return user ticket', async () => {
        await buyTicket();
        const ticket = await lottery.getUserTicketByAddress(1n, 1n, provider.address);
        console.log(`User ${provider.address} ticket: `, ticket);
        expect(ticket?.ticket).not.toBeNull();
    });

    it('should get claim Data', async () => {
        const claimData = await lottery.getClaimData(1n, 1n);
        console.log('claimData', claimData);
    });

    it('should return is claim', async () => {
        const claimData = await lottery.getIsClaim(1n, 1n, provider.address);
        console.log('is_claim', claimData);
    });

    it('should draw winner error when round active', async() => {
        let draw = await lottery.send(
            admin.getSender(), {
                value: toNano('0.05'),
            },
            {
                $$type: 'DrawWinningNumbers',
                poolId: poolId,
                roundId: roundId,
                latestTxHash: '0x'
            }
        );

        expect(draw.transactions).toHaveTransaction({
            from: admin.address,
            to: lottery.address,
            exitCode: 50778,
            success: false,
        });
    })

    it('should draw winner success', async() => {
        await sleep(10000);
        let draw = await lottery.send(
            admin.getSender(), {
                value: toNano('0.05'),
            },
            {
                $$type: 'DrawWinningNumbers',
                poolId: poolId,
                roundId: roundId,
                latestTxHash: '0x'
            }
        );

        expect(draw.transactions).toHaveTransaction({
            from: admin.address,
            to: lottery.address,
            success: true,
        });
        let resultByRound = await lottery.getResultByRound(1n, 1n);
        console.log('resultByRound', resultByRound);
        expect(resultByRound).not.toBeNull();
    })

    it('should claim reward', async () => {
        let claimer = await blockchain.treasury('claimer1');
        console.log('claimer 1: ', claimer.address);
        let claimer2 = await blockchain.treasury('claimer2');
        console.log('claimer 2: ', claimer2.address);

        await buyTicket(claimer, poolId, roundId, 1n);
        await buyTicket(claimer2, poolId, roundId, 1n);
        console.log('Before claimer balance: ', await claimer.getBalance());
        console.log('Before claimer2 balance: ', await claimer2.getBalance());

        let airDropAmount: bigint = toNano(0.01);
        const signatureData = beginCell()
            .storeInt(1, 32)
            .storeInt(1, 32)
            .storeAddress(claimer.address)
            .storeCoins(airDropAmount)
            .endCell();
        const signatureData2 = beginCell()
            .storeInt(1, 32)
            .storeInt(1, 32)
            .storeAddress(claimer2.address)
            .storeCoins(airDropAmount)
            .endCell();
        const keyPair = await mnemonicToWalletKey(mnemonic);
        const signature = sign(signatureData.hash(), keyPair.secretKey);
        let signatureCell = beginCell().storeBuffer(signature).asSlice();

        const signature2 = sign(signatureData2.hash(), keyPair.secretKey);
        let signatureCell2 = beginCell().storeBuffer(signature2).asSlice();

        let claim = await lottery.send(
            claimer.getSender(), {
                value: toNano('0.02'),
            },
            {
                $$type: 'Claim',
                poolId: poolId,
                roundId: roundId,
                amount: airDropAmount,
                receiver: claimer.address,
                signature: signatureCell
            }
        );

        let claim2 = await lottery.send(
            claimer2.getSender(), {
                value: toNano('0.02'),
            },
            {
                $$type: 'Claim',
                poolId: poolId,
                roundId: roundId,
                amount: airDropAmount,
                receiver: claimer2.address,
                signature: signatureCell2
            }
        );
        console.log('After claimer balance: ', await claimer.getBalance());
        console.log('After claimer2 balance: ', await claimer2.getBalance());
        expect(claim.transactions).toHaveTransaction({
            from: claimer.address,
            to: lottery.address,
            value: 20000000n,
            success: true,
        });

        expect(claim2.transactions).toHaveTransaction({
            from: claimer2.address,
            to: lottery.address,
            value: 20000000n,
            success: true,
        });


        expect(claim.transactions).toHaveTransaction({
            from: lottery.address,
            to: claimer.address,
            success: true,
        });
        expect(claim2.transactions).toHaveTransaction({
            from: lottery.address,
            to: claimer2.address,
            success: true,
        });

        const claimData = await lottery.getClaimData(poolId, roundId);
        console.log('claimData', claimData);

        const isClaimData = await lottery.getIsClaim(poolId, roundId, claimer.address);
        console.log('is_claim', isClaimData);

        const isClaimData2 = await lottery.getIsClaim(poolId, roundId, claimer2.address);
        console.log('is_claim2', isClaimData2);

    });
    it('should be shown already claimed', async () => {
        let claimer = await blockchain.treasury('wallet');
        console.log('claimer 1: ', claimer.address);
        console.log('claimer balance 1: ', await claimer.getBalance());

        await buyTicket(claimer, poolId, roundId, 1n);

        let airDropAmount: bigint = toNano(0.01);
        const signatureData = beginCell()
            .storeInt(1, 32)
            .storeInt(1, 32)
            .storeAddress(claimer.address)
            .storeCoins(airDropAmount)
            .endCell();
        const keyPair = await mnemonicToWalletKey(mnemonic);
        const signature = sign(signatureData.hash(), keyPair.secretKey);
        let signatureCell = beginCell().storeBuffer(signature).asSlice();

        let claim = await lottery.send(
            claimer.getSender(), {
                value: toNano('0.02'),
            },
            {
                $$type: 'Claim',
                poolId,
                roundId,
                amount: airDropAmount,
                receiver: claimer.address,
                signature: signatureCell
            }
        );
        console.log('claimer 2: ', claimer.address);
        console.log('claimer balance 2: ', await claimer.getBalance());

        expect(claim.transactions).toHaveTransaction({
            from: claimer.address,
            to: lottery.address,
            value: 20000000n,
            success: true,
        });

        expect(claim.transactions).toHaveTransaction({
            from: lottery.address,
            to: claimer.address,
            success: true,
        });

        const claimData = await lottery.getClaimData(poolId, roundId);
        console.log('claimData', claimData);

        const isClaimData = await lottery.getIsClaim(poolId, roundId, claimer.address);
        console.log('is_claim', isClaimData);

        let claim2 = await lottery.send(
            claimer.getSender(), {
                value: toNano('0.02'),
            },
            {
                $$type: 'Claim',
                poolId,
                roundId,
                amount: airDropAmount,
                receiver: claimer.address,
                signature: signatureCell
            }
        );

        expect(claim2.transactions).toHaveTransaction({
            from: claimer.address,
            to: lottery.address,
            value: 20000000n,
            exitCode: 42504, // already claimed
            success: false,
        });

        expect(claim2.transactions).toHaveTransaction({
            from: lottery.address,
            to: claimer.address,
            success: true,
        });

        const claimData2 = await lottery.getClaimData(poolId, roundId);
        console.log('claimData2', claimData2);

        const isClaimData2 = await lottery.getIsClaim(poolId, roundId, claimer.address);
        console.log('is_claim2', isClaimData2);

    });
});
