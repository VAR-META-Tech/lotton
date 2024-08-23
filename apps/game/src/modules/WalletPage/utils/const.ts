export const TAB_VALUE = {
  WALLET: 'wallet',
  TRANSACTIONS: 'transactions',
};

export const TAB_LABEL = {
  WALLET: 'Wallet',
  TRANSACTIONS: 'Transactions',
};

export const TAB_DATA = [
  {
    value: TAB_VALUE.WALLET,
    label: TAB_LABEL.WALLET,
  },
  {
    value: TAB_VALUE.TRANSACTIONS,
    label: TAB_LABEL.TRANSACTIONS,
  },
];

export const transactions = [
  {
    type: 'Claim',
    address: '0xb17e91a...4689f',
    amount: '+10.000 TON',
    date: '2024-08-23T10:00:00Z',
  },
  {
    type: 'Buy tickets',
    address: '0xb17e91a...4689f',
    amount: '-15.000 TON',
    date: '2024-08-23T14:30:00Z',
  },
  {
    type: 'Claim',
    address: '0xb17e91a...4689f',
    amount: '+30.000 TON',
    date: '2024-05-10T08:00:00Z',
  },
  {
    type: 'Buy tickets',
    address: '0xb17e91a...4689f',
    amount: '-15.000 TON',
    date: '2024-05-10T12:45:00Z',
  },
  {
    type: 'Buy tickets',
    address: '0xb17e91a...4689f',
    amount: '-20.000 NOT',
    date: '2024-05-10T16:00:00Z',
  },
  {
    type: 'Buy tickets',
    address: '0xb17e91a...4689f',
    amount: '-1.000 NOT',
    date: '2024-05-10T18:15:00Z',
  },
];
