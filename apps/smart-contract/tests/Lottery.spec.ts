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
                $$type: 'CreatePool',
                ticketPrice: 1n,
                initialRounds: 1n,
                startTime: 1724511710n,
                endTime: 1735511710n,
                sequence: 3600n,
                jettonWallet: provider.address,
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
                value: toNano('3.05'),
            },
            {
                $$type: 'BuyTicket',
                poolId: 1n,
                roundId: 1n,
                quantity: 3n
            }
        );
        const balance2 = await provider.getBalance();
        console.log('balance2', balance2);

        expect(ticket.transactions).toHaveTransaction({
            from: provider.address,
            to: lottery.address,
            success: true,
        });
    });

    it('should return user ticket', async () => {
        const provider = await blockchain.treasury('wallet');
        const ticket = await lottery.getUsersTicket(1n, 1n);
        console.log('ticket', ticket);
        expect(ticket).toBe(1n);
    });
});
