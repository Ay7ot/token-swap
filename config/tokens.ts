export interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI: string;
    chainId: number;
}

export const MAINNET_TOKENS: Token[] = [
    {
        symbol: 'ETH',
        name: 'Ethereum',
        address: 'ETH',
        decimals: 18,
        logoURI: '/tokens/eth.png',
        chainId: 1,
    },
    {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6,
        logoURI: '/tokens/usdc.png',
        chainId: 1,
    },
    {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6,
        logoURI: '/tokens/usdt.png',
        chainId: 1,
    },
    {
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        decimals: 8,
        logoURI: '/tokens/wbtc.png',
        chainId: 1,
    },
    // Add more tokens as needed
];