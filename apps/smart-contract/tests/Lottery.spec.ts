import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, beginCell, Dictionary, toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import '@ton/test-utils';
import now = jest.now;
import { sleep } from '@ton/blueprint';

describe('Lottery', () => {
    jest.setTimeout(30000)
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let lottery: SandboxContract<Lottery>;
    let provider: SandboxContract<TreasuryContract>;

    async function createPool() {
        let prizes: Dictionary<number, number> = Dictionary.empty(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8));
        prizes.set(1, 10);
        prizes.set(2, 15);
        prizes.set(3, 20);
        prizes.set(4, 25);

        const now = Math.floor(Date.now()/1000);

        const pool = await lottery.send(
            provider.getSender(), {
                value: toNano('1.05'),
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

        return pool;
    }

    async function setAdmin() {
        const admin = await lottery.send(
            provider.getSender(), {
                value: toNano('0.05'),
            },
            {
                $$type: 'SetAdmin',
                admin: provider.address,
            }
        );

        return admin;
    }

    async function buyTicket() {
        let userTicket = await lottery.send(
            provider.getSender(), {
                value: toNano('3.005'),
            },
            {
                $$type: 'BuyTicket',
                poolId: 1n,
                roundId: 1n,
                quantity: 1n
            }
        );

        return userTicket;
    }

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        lottery = blockchain.openContract(await Lottery.fromInit());

        deployer = await blockchain.treasury('deployer');
        provider = await blockchain.treasury('wallet');

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

        // Set admin
        console.log('provider', provider.address);
        const admin = await setAdmin();
        expect(admin.transactions).toHaveTransaction({
            from: provider.address,
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

    it('should get claim Data', async () => {
        const claimData = await lottery.getClaimData(1n, 1n);
        console.log('claimData', claimData);
    });

    it('should return is claim', async () => {
        const claimData = await lottery.getIsClaim(1n, 1n, provider.address);
        console.log('is_claim', claimData);
    });


    it('should return user ticket', async () => {
        await buyTicket();
        const ticket = await lottery.getUserTicketByAddress(1n, 1n, provider.address);
        console.log('User ticket: ', ticket);
        expect(ticket?.ticket).not.toBeNull();
    });

    it('should claim reward', async () => {
        let claimer = await blockchain.treasury('wallet');
        console.log('claimer 1: ', claimer.address);
        console.log('claimer balance 1: ', await claimer.getBalance());
        let claim = await lottery.send(
            claimer.getSender(), {
                value: toNano('0.02'),
            },
            {
                $$type: 'Claim',
                poolId: 1n,
                roundId: 1n,
                amount: toNano(0.01),
                receiver: claimer.address,
                signature: beginCell().asSlice()
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
            value: toNano('0.05'),
            success: true,
        });

    });
});
