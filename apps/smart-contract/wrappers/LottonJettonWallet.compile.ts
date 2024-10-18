import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/lotton_jetton_wallet.tact',
    options: {
        debug: true,
    },
};
