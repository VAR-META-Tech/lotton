import "@stdlib/deploy";

// Constants
const SECONDS_PER_HOUR: Int = 3600;
const TICKET_DIGITS: Int = 4;
const MAX_TICKET_NUMBER: Int = 9999;

// Struct to represent a ticket
struct Ticket {
    owner: Address;
    numbers: Int;
}

struct Pool {
    poolId: Int as uint32;
    token: Address;
    creator: Address;
    rounds: map<Int, RoundConfig>;
    startTime: Int as uint32;
    endTime: Int as uint32;
    active: Bool;
}

// Struct to represent a round configuration
struct RoundConfig {
    roundId: Int as uint32;
    poolId: Int as uint32;
    ticketPrice: Int as coins;
    startTime: Int as uint32;
    endTime: Int as uint32;
    active: Bool;
}

message PoolCreated {
    poolId: Int;
    token: Address;
    ticketPrice: Int as uint32;
    initialRounds: Int as uint8;
    startTime: Int as uint32;
    endTime: Int as uint32;
    active: Bool;
}

message PoolCreatedEvent {
    poolId: Int;
    token: Address;
    ticketPrice: Int as uint32;
    initialRounds: Int as uint8;
    startTime: Int as uint32;
    endTime: Int as uint32;
    active: Bool;
    creator: Address;
}

message RoundCreated {
    roundId: Int as uint32;
    poolId: Int as uint32;
    ticketPrice: Int as uint32;
    startTime: Int;
    endTime: Int;
}

// Main contract
contract Lottery with Deployable {
    owner: Address;
    tokenPool: Int ;
    currentRound: Int;
    rounds: map<Int, RoundConfig>;
    tickets: map<Int, Ticket>;
    winningNumbers: map<Int, Int>;
    pools: map<Int, Pool>;
    nextPoolId: Int;


    init() {
        self.owner = sender();
        self.tokenPool = 0;
        self.currentRound = 0;
        self.nextPoolId = 1;
    }

    // ----------------- Admin functions ----------------- //

    fun createPool(token: Address, initialRounds: Int, config: RoundConfig) {
        require(sender() == self.owner, "Only owner can create pool");

        let poolId: Int = self.nextPoolId;
        self.nextPoolId += 1;

        let pool: Pool = Pool{
            poolId: poolId,
            token: token,
            creator: sender(),
            rounds: emptyMap(),
            startTime: config.startTime,
            endTime: config.endTime,
            active: true
        };

        let index: Int = 1;
        repeat (initialRounds) {
            let roundConfig: RoundConfig = RoundConfig{
                roundId: index,
                poolId: poolId,
                ticketPrice: config.ticketPrice,
                startTime: config.startTime + (index - 1) * SECONDS_PER_HOUR * 24, // Mỗi vòng kéo dài 1 ngày
                endTime: config.startTime + index * SECONDS_PER_HOUR * 24,
                active: true
            };
            pool.rounds.set(index, roundConfig);
            index += 1;
        }

        self.pools.set(poolId, pool);

        emit(PoolCreatedEvent{
            poolId: poolId,
            token: token,
            ticketPrice: config.ticketPrice,
            initialRounds: initialRounds,
            startTime: config.startTime,
            endTime: config.endTime,
            active: true,
            creator: sender()
        }.toCell());

    }

    // TODO
    fun addRound(config: RoundConfig) {
    require(sender() == self.owner, "Only owner can add rounds");
    // Implementation for adding a new round
    }

    // ---------------- User functions ---------------- //

    fun buyTicket(poolId: Int, roundId: Int, quantity: Int) {
        let pool: Pool = self.pools.get(poolId)!!;
        require(pool.active, "Pool is not active");

        let round: RoundConfig = pool.rounds.get(roundId)!!;
        require(round.active, "Round is not active");
        require(now() >= round.startTime && now() < round.endTime, "Round is not open for ticket purchases");

        require(quantity > 0, "Quantity must be positive");

        let user: Address = sender();
        let totalCost: Int = round.ticketPrice * quantity;

        require(context().value >= totalCost, "Insufficient funds sent");
        // gen ticket code
        // Xử lý thanh toán ở đây
    }
    fun claimPrize(roundId: Int) {
    // Implementation for claiming prizes
    }

    // Internal functions

    fun drawWinningNumbers(roundId: Int) {
    // Implementation for drawing winning numbers
    }

    fun calculatePrizes(roundId: Int) {
    // Implementation for calculating and distributing prizes
    }

    receive(msg: PoolCreated) {
        let token: Address = msg.token;
        let initialRounds: Int = msg.initialRounds;
        let ticketPrice: Int = msg.ticketPrice;
        let startTime: Int = msg.startTime;
        let endTime: Int = msg.endTime;

        let config: RoundConfig = RoundConfig{
        roundId: 0, // Sẽ được set trong hàm createPool
        poolId: 0, // Sẽ được set trong hàm createPool
        ticketPrice: ticketPrice,
        startTime: startTime,
        endTime: endTime,
        active: true
        };

        self.createPool(token, initialRounds, config);
    }

    // Getter functions

    get fun getCurrentRound(): Int {
        return self.currentRound;
    }

    get fun getRoundConfig(roundId: Int): RoundConfig? {
        return self.rounds.get(roundId);
    }

    get fun getWinningNumbers(roundId: Int): Int? {
        return self.winningNumbers.get(roundId);
    }
}
