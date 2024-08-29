module.exports = {
  apps: [
    {
      name: 'lottery-ton-api',
      script: 'pnpm start:prod',
    },
    {
      name: 'lottery-ton-worker',
      script: 'pnpm start:prod-worker',
    },
  ],
};
