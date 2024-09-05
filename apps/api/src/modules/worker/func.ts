export function calculatorMatch(userCode: string, winningCode: string) {
  for (let index = winningCode.length; index >= 0; index--) {
    if (userCode.slice(0, index) === winningCode.slice(0, index)) return index;
  }

  return 0;
}

export function splitTickets(ticketsList: string, quantity: number) {
  const ticketsString = ticketsList
    .replace(/,/g, '')
    .substring(0, 4 * 2 * quantity);

  const tickets = [];
  for (let i = 0; i < ticketsString.length; i += 8) {
    const ticket = ticketsString.substring(i, i + 8);
    let ticketConvert = '';

    for (let i = 0; i < ticket.length; i += 2) {
      const ticketChar = ticket.substring(i, i + 2);
      ticketConvert += String.fromCharCode(+ticketChar);
    }
    tickets.push(ticketConvert);
  }

  return tickets;
}
