import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import '@ton/test-utils';
import now = jest.now;
import { sleep } from '@ton/blueprint';

describe('Lottery', () => {
    jest.setTimeout(30000)
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let lottery: SandboxContract<Lottery>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        lottery = blockchain.openContract(await Lottery.fromInit());

        deployer = await blockchain.treasury('deployer');

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
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and lottery are ready to use
    });

    it('should create pool', async () => {
        const provider = await blockchain.treasury('wallet');

        const pool = await lottery.send(
            provider.getSender(), {
                value: toNano('0.05'),
            },
            {
                $$type: 'PoolCreated',
                ticketPrice: 1n,
                initialRounds: 1n,
                startTime: 1724511710n,
                endTime: 1735511710n,
                active: true,
            }
        );
        expect(pool.transactions).toHaveTransaction({
            from: provider.address,
            to: lottery.address,
            success: false,
        });
    });

    it('should return current pool', async () => {
        const getPool = await lottery.getCurrentPool();
        console.log('getPool', getPool);
        expect(getPool).toBe(1n);
    });

    it('should return current round is 1n', async () => {
        const getRound = await lottery.getCurrentRound();
        console.log('getRound', getRound);
        expect(getRound?.roundId).toBe(1n);
    });

    it('should return current round is active', async () => {
        const getRound = await lottery.getCurrentRound();
        console.log('getRound', getRound);
        expect(getRound?.active).toBe(true);
    });

    it('should return current round is not expired', async () => {
        const getRound = await lottery.getCurrentRound();
        console.log('getRound', getRound);
        expect(getRound?.startTime).toBe(1724511710n);
        expect(getRound?.endTime).toBe(1735511710n);
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
        const ticket = await lottery.send(
            provider.getSender(), {
                value: toNano('1.05'),
            },
            {
                $$type: 'BuyTicket',
                poolId: 1n,
                roundId: 1n,
                quantity: 1n
            }
        );
        const balance2 = await provider.getBalance();
        console.log('balance2', balance2);

        expect(ticket.transactions).toHaveTransaction({
            from: provider.address,
            to: lottery.address,
            success: false,
        });
    });
});
