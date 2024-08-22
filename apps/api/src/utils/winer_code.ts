export const checkTicketWinner = (ticketCode: string, winningCode: string) => {
  for (let i = 0; i < 4; i++) {
    if (ticketCode[i] != winningCode[i]) return i;
  }
  return 4;
};
