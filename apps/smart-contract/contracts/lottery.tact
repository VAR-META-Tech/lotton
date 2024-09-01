import "@stdlib/deploy";
import "@stdlib/ownable";

// Constants
const TICKET_DIGITS: Int = 4;
const MAX_TICKET_NUMBER: Int = 99999;

// Main contract
contract Lottery with Deployable, Ownable {
    owner: Address;
    admin: map<Address, Bool>;
    pools: map<Int, Pool>;
    nextPoolId: Int;
    usersTicket: map<Int, RoundTicket>;
    rewardSettings: map<Int,Int>;
    result: map<Int,Result>;
    rewardPools: map<Int,Int>;
    publicKey: Int?;
    claimData: map<Int, ClaimInfo>;

    init() {
        self.owner = sender();
        self.nextPoolId = 1;
        self.publicKey = 0;
        // Default reward settings
        self.rewardSettings.set(1, 10);
        self.rewardSettings.set(2, 20);
        self.rewardSettings.set(3, 30);
        self.rewardSettings.set(4, 40);
    }

    // =============== Private Methods ============== //

    fun requireOwnerOrAdmin() {
        require(sender() == self.owner || self.admin.get(sender())!!, "Only the owner or admin can call this function");
    }

    fun setAdmin(admin: Address) {
        //self.requireOwner();
        self.admin.set(admin, true);
    }

    fun getLength(content: Slice): Int {
        let i: Int = 0;
        let length: Int = 0;
        let needBreak: Bool = false;
        do {
            let char: Int = content.loadUint(8);
            needBreak = char == 0;
            if (!needBreak) {
                i = i + 8;
                length = length + 1;
            }
        } until (needBreak);
        return length;
    }


    fun createPool(initialRounds: Int, sequence: Int, config: RoundConfig) {
        self.requireOwnerOrAdmin();

        let poolId: Int = self.nextPoolId;
        self.nextPoolId += 1;

        let pool: Pool = Pool{
            poolId: poolId,
            creator: sender(),
            rounds: emptyMap(),
            startTime: config.startTime,
            endTime: config.endTime,
            sequence: sequence,
            active: true
        };

        let roundTickets = RoundTicket{
            rounds: emptyMap()
        };

        let index: Int = 1;
        repeat (initialRounds) {
            let startTime: Int = config.startTime + (index - 1) * sequence;
            let endRoundTime: Int = config.startTime + index * sequence;
            let roundConfig: RoundConfig = RoundConfig{
                roundId: index,
                poolId: poolId,
                ticketPrice: config.ticketPrice,
                startTime: startTime,
                endTime: config.endTime < endRoundTime ? config.endTime : endRoundTime,
                active: true
            };
            roundTickets.rounds.set(index, UserTicket{
                users: emptyMap()
            });
            pool.rounds.set(index, roundConfig);
            index += 1;
        }
        self.pools.set(poolId, pool);
        self.usersTicket.set(poolId, roundTickets);

        emit(PoolCreatedEvent{
            poolId: poolId,
            ticketPrice: config.ticketPrice,
            initialRounds: initialRounds,
            startTime: config.startTime,
            endTime: config.endTime,
            active: true,
            sequence,
            rounds: pool.rounds,
            creator: sender()
        }.toCell());
    }

    fun rewardSettings(match:Int, percent: Int) {
        self.requireOwnerOrAdmin();
        require(match >= 1 && match <= TICKET_DIGITS, "Invalid match number");
        require(percent >= 0 && percent <= 100, "Invalid reward percentage");
        self.rewardSettings.set(match, percent);
    }

    // ---------------- User functions ---------------- //
    fun asciiToChar(ascii: Int): String {
        if (ascii >= 48 && ascii <= 57) {
            // Chuyển đổi số (0-9)
            // return (ascii - 48).toString()
            return ascii.toString();
        } else if (ascii >= 65 && ascii <= 90) {
            // Chuyển đổi chữ cái in hoa (A-Z)
            return ascii.toString();
        } else {
            return "";
        }
    }
    // Function to generate a random ASCII string
    fun generateRandomASCIIString(length: Int): RandomTicketResponse {
        let result: StringBuilder = beginString();
        let asciiNumber: Int = 0;
        // ASCII range (48-57 for numbers, 65-90 for upper letters)
        repeat(length) {
            let isDigit: Bool = random(0, 2) == 0;
            let randomInt: Int = 0;
            if (isDigit) {
                randomInt = random(48, 58); // [48-58)
            } else {
                randomInt = random(65, 91); // [65-91)
            }
            asciiNumber = asciiNumber * 100 + randomInt;
            result.append(self.asciiToChar(randomInt));
        }
        return RandomTicketResponse{
            ASCIINumber: asciiNumber,
            ticket: result.toString()
        };
    }

    fun convertTicketNumberToString(ticketNumber: Int): String {
        let ticketNumberTmp = ticketNumber;
        let result: StringBuilder = beginString();
        let base: Int = pow(100, TICKET_DIGITS);
        while(ticketNumberTmp > 0) {
            let asciiChar = ticketNumberTmp / base;
            if (asciiChar >= 48 && asciiChar <= 57) || (asciiChar >= 65 && asciiChar <= 90) {
                result.append(self.asciiToChar(asciiChar));
            }
            ticketNumberTmp = ticketNumberTmp % base;
        }
        return result.toString();
    }

    fun convertStringToTicketNumber(ticket: String): Int? {
        return 0;
    }

    fun createTicket(user: Address, poolId: Int, roundId: Int, quantity: Int): String {
        let newTickets: StringBuilder = beginString();

        repeat (quantity) {
            let rs: RandomTicketResponse = self.generateRandomASCIIString(TICKET_DIGITS);
            let ticketNumber: Int = rs.ASCIINumber;
            let ticket: String = rs.ticket;

            if (newTickets.toString() != "") {
                newTickets.append(",");
            }
            newTickets.append(ticket);

            let ticketData: Ticket = Ticket {
                ticket,
                ticketNumber,
                owner: user
            };
        }

        let userTicketPool = self.usersTicket.get(poolId);
        if (userTicketPool != null) {
            let roundsTicket = userTicketPool!!.rounds.get(roundId);
            if (roundsTicket != null) {
                let usersTicket = roundsTicket!!.users;
                let existingTickets = usersTicket.get(user);
                if (newTickets.toString() != "" && existingTickets != null) {
                    newTickets.append(",");
                }
                if (existingTickets != null) {
                    let ticketPayoutResponse: TicketPayoutResponse = existingTickets!!;
                    newTickets.append(ticketPayoutResponse.ticket);
                }

                let ticketPayout = TicketPayoutResponse{
                    ticket: newTickets.toString()
                };
                let userTicket = UserTicket{
                    users: usersTicket
                };
                userTicket.users.set(user, ticketPayout);

                let roundTicket = RoundTicket{
                    rounds: userTicketPool!!.rounds
                };
                roundTicket.rounds.set(roundId, userTicket);
                self.usersTicket.set(poolId, roundTicket);
            }
        }
        return newTickets.toString();
    }

    fun buyTicket(poolId: Int, roundId: Int, quantity: Int) {
        let pool: Pool? = self.pools.get(poolId);
        if (pool == null) {
            require(false, "Pool does not exist");
        }
        let poolInfo = pool!!;
        require(poolInfo.active, "Pool is not active");

        let round: RoundConfig? = poolInfo.rounds.get(roundId);
        if (round == null) {
            require(false, "Round does not exist");
        }
        let roundInfo = round!!;
        require(roundInfo.active, "Round is not active");

        require(now() >= roundInfo.startTime && now() < roundInfo.endTime, "Round is not open for ticket purchases");
        require(quantity > 0, "Quantity must be positive");

        let user: Address = sender();
        let totalCost: Int = roundInfo.ticketPrice * quantity;
        require(context().value >= totalCost, "Insufficient funds sent");

        // gen random ticket code
        let tickets: String = self.createTicket(user, poolId, roundId, quantity);

        // Send any excess funds back to the user
        if (context().value > totalCost) {
            send(SendParameters{
                to: user,
                value: context().value - totalCost,
                mode: (SendRemainingValue + SendIgnoreErrors)
            });
        }

        emit(TicketBoughtEvent{
            roundId: roundId,
            poolId: poolId,
            quantity: quantity,
            buyer: user,
            tickets: tickets
        }.toCell());
    }

    // Internal functions

    // Function to calculate the number of matching digits between the result and the ticket
    fun calculateMatching(result: Int, ticket: Int): Int {
        let base: Int = pow(100, TICKET_DIGITS);
        while (result > 0 && ticket > 0) {
            if (result % base == ticket % base) {
                return 1 + self.calculateMatching(result / 100, ticket / 100);
            }
            result /= 100;
            ticket /= 100;
        }
        return 0;
    }

    // Function to calculate the prize for a ticket
    fun drawWinningNumbers(poolId: Int, roundId: Int, latestTxHash: String?) {
        self.requireOwnerOrAdmin();
        let resultPool = self.result.get(poolId);
        if (resultPool != null) {
            let resultRound: Int? = resultPool!!.rounds.get(roundId);
            if (resultRound != null) {
                require(false, "Winning numbers already drawn");
            }
        } else {
            self.result.set(poolId, Result{
                rounds: emptyMap()
            });
            resultPool = self.result.get(poolId);
        }
        let round = self.roundById(poolId, roundId);
        require(round != null, "Round does not exist");

        let roundInfo = round!!;
        //require(now() >= roundInfo.endTime, "Round is still active");

        let rs: RandomTicketResponse = self.generateRandomASCIIString(TICKET_DIGITS);
        let ticketNumber = rs.ASCIINumber;

        let resultData = Result{
            rounds: resultPool!!.rounds
        };
        resultData.rounds.set(roundId, ticketNumber);
        self.result.set(poolId, resultData);

        emit(WinningNumbersDrawnEvent{
            poolId: roundInfo.poolId,
            roundId: roundInfo.roundId,
            winningNumber: ticketNumber
        }.toCell());
    }

    fun getMessageHash(poolId: Int, roundId: Int, amount: Int, receiver: Address): Int {
        let signatureData: Cell = beginCell()
            .storeInt(poolId, 32)
            .storeInt(roundId, 32)
            .storeAddress(receiver)
            .storeCoins(amount)
            .endCell();
        return signatureData.hash();
    }

    // Function to check the signature of a message
    fun claimPrize(msg: Claim) {
        let msgHash: Int = self.getMessageHash(msg.poolId, msg.roundId, msg.amount, msg.receiver);
        require(checkSignature(msgHash, msg.signature, self.publicKey!!), "Invalid signature");

        let isClaimed: Bool = self.isClaim(msg.poolId, msg.roundId, msg.receiver);
        require(!isClaimed, "Invalid claim");

        let claimUser = UserClaim{
            user: emptyMap()
        };
        claimUser.user.set(msg.receiver, true);

        let claimPool = self.claimData.get(msg.poolId);
        if (claimPool == null) {
            let claimInfo = ClaimInfo {
                info: emptyMap()
            };
            claimInfo.info.set(msg.roundId, claimUser);
            self.claimData.set(msg.poolId, claimInfo);
        } else {
            let claimInfo = claimPool!!.info.get(msg.roundId)!!;
            if (claimInfo.user.get(msg.receiver) == null){
                let currentClaimInfo = ClaimInfo {
                    info: claimPool!!.info
                };
                currentClaimInfo.info.set(msg.roundId, claimUser);
                self.claimData.set(msg.poolId, currentClaimInfo);
            } else {
                require(false, "Invalid claim");
            }
        }
        //send the token to user
        send(SendParameters{
            to: msg.receiver,
            value: msg.amount,
            mode: (SendRemainingValue + SendIgnoreErrors),
        });

        emit(ClaimedEvent{
            poolId: msg.poolId,
            roundId: msg.roundId,
            amount: msg.amount,
            receiver: msg.receiver
        }.toCell());
    }

    receive(msg: CreatePool) {
        let initialRounds: Int = msg.initialRounds;
        let ticketPrice: Int = msg.ticketPrice;
        let startTime: Int = msg.startTime;
        let endTime: Int = msg.endTime;
        let sequence: Int = msg.sequence;

        let config: RoundConfig = RoundConfig{
            roundId: 0, // Sẽ được set trong hàm createPool
            poolId: 0, // Sẽ được set trong hàm createPool
            ticketPrice: ticketPrice,
            startTime: startTime,
            endTime: endTime,
            active: true
        };

        self.createPool(initialRounds, sequence, config);
    }

    receive(msg: RewardSetting) {
        let match: Int = msg.match;
        let percent: Int = msg.percent;
        self.rewardSettings(match, percent);
    }

    receive(msg: BuyTicket) {
        let poolId: Int = msg.poolId;
        let roundId: Int = msg.roundId;
        let quantity: Int = msg.quantity;
        self.buyTicket(poolId, roundId, quantity);
    }

    receive(msg: DrawWinningNumbers) {
        let poolId: Int = msg.poolId;
        let roundId: Int = msg.roundId;
        let latestTxHash: String = msg.latestTxHash;
        self.drawWinningNumbers(poolId, roundId, latestTxHash);
    }

    receive(msg: SetAdmin) {
        self.setAdmin(msg.admin);
    }

    receive(msg: Claim){
        self.claimPrize(msg);
    }

    receive(msg: SetPublicKey) {
        self.publicKey = msg.publicKey;
    }

    // Getter functions
    get fun admins(): map<Address, Bool>{
        return self.admin;
    }

    get fun isAdmin(address: Address): Bool {
        return self.admin.get(address)!!;
    }

    get fun currentPool(): map<Int, Pool>{
        return self.pools;
    }

    get fun poolById(poolId: Int): Pool? {
        return self.pools.get(poolId);
    }

    get fun usersTicket(poolId: Int, roundId: Int): UserTicket {
        return self.usersTicket.get(poolId)!!.rounds.get(roundId)!!;
    }

    get fun userTicketByAddress(poolId: Int, roundId: Int, user: Address): TicketPayoutResponse? {
        return self.usersTicket.get(poolId)!!.rounds.get(roundId)!!.users.get(user);
    }

    get fun roundById(poolId: Int, roundId: Int): RoundConfig? {
        return self.pools.get(poolId)!!.rounds.get(roundId)!!;
    }

    get fun resultByRound(poolId: Int, roundId: Int): Int? {
        let resultPool: Result? = self.result.get(poolId);
        if (resultPool != null) {
            return resultPool!!.rounds.get(roundId);
        }
        return null;
    }

    get fun resultByPool(poolId: Int): Result? {
        return self.result.get(poolId);
    }

    get fun publicKey(): Int? {
        return self.publicKey;
    }

    get fun claimData(poolId: Int, roundId: Int): UserClaim? {
        return self.claimData.get(poolId)!!.info.get(roundId);
    }

    get fun isClaim(poolId: Int, roundId: Int, receiver: Address): Bool{
        let isClaimed: Bool? = self.claimData.get(poolId)!!.info.get(roundId)!!.user.get(receiver);
        if (isClaimed != null) {
            let isClaimedValue: Bool = self.claimData.get(poolId)!!.info.get(roundId)!!.user.get(receiver)!!;
            if(isClaimedValue){
                return true;
            }
        }
        return false;
    }
}

// ---------------- Structs ---------------- //

struct Pool {
    poolId: Int as uint32;
    creator: Address;
    rounds: map<Int, RoundConfig>;
    startTime: Int as uint32;
    endTime: Int as uint32;
    sequence: Int as uint32;
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

struct TicketPayoutResponse {
    ticket: String;
}

struct RandomTicketResponse {
    ASCIINumber: Int;
    ticket: String;
}

struct Ticket {
    ticket: String;
    ticketNumber: Int;
    owner: Address;
}

struct UserTicket {
    users: map<Address, TicketPayoutResponse>
}
struct RoundTicket {
    rounds: map<Int, UserTicket>
}

struct Winner {
    ticket: String;
    owner: Address;
    prize: Int as coins;
}

struct ClaimInfo {
    info: map<Int, UserClaim>;
}

struct UserClaim {
    user: map<Address, Bool>;
}

struct Result {
    rounds: map<Int, Int>;
}
// ---------------- Messages ---------------- //

message CreatePool {
    jettonWallet: Address;
    ticketPrice: Int as uint32;
    initialRounds: Int as uint8;
    startTime: Int as uint32;
    endTime: Int as uint32;
    sequence: Int as uint32;
    active: Bool;
}

message Claim {
    poolId: Int;
    roundId: Int;
    amount: Int as coins;
    receiver: Address;
    signature: Slice;
}

message WinningNumbersDrawnEvent {
    poolId: Int;
    roundId: Int;
    winningNumber: Int;
}

message RewardSetting {
    match: Int;
    percent: Int;
}

message BuyTicket {
    poolId: Int;
    roundId: Int;
    quantity: Int;
}

message DrawWinningNumbers {
    poolId: Int;
    roundId: Int;
    latestTxHash: String;
}

message SetAdmin {
    admin: Address;
}

message SetPublicKey {
    publicKey: Int;
}

// ---------------- Events ---------------- //
message PoolCreatedEvent {
    poolId: Int;
    ticketPrice: Int as uint32;
    initialRounds: Int as uint8;
    startTime: Int as uint32;
    endTime: Int as uint32;
    active: Bool;
    sequence: Int as uint32;
    rounds: map<Int, RoundConfig>;
    creator: Address;
}

message RoundCreated {
    roundId: Int;
    poolId: Int;
    ticketPrice: Int as uint32;
    startTime: Int as uint32;
    endTime: Int as uint32;
}

message TicketBoughtEvent {
    poolId: Int;
    roundId: Int;
    quantity: Int;
    buyer: Address;
    tickets: String
}

message ClaimedEvent {
    poolId: Int;
    roundId: Int;
    amount: Int as coins;
    receiver: Address;
}
