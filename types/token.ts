export interface TokenData {
    id: string;
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    chainId: number;
    image: string;
    current_price?: number;
    market_cap?: number;
    market_cap_rank?: number;
}

export const DEFAULT_TOKENS: TokenData[] = [
    {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        address: 'ETH',
        decimals: 18,
        chainId: 1,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    },
    {
        id: 'usd-coin',
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6,
        chainId: 1,
        image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    },
    {
        id: 'tether',
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6,
        chainId: 1,
        image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
    },
    {
        id: 'wrapped-bitcoin',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        decimals: 8,
        chainId: 1,
        image: 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png',
    },
    {
        id: 'dai',
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        decimals: 18,
        chainId: 1,
        image: 'https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png',
    },
    {
        id: 'chainlink',
        symbol: 'LINK',
        name: 'Chainlink',
        address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        decimals: 18,
        chainId: 1,
        image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    },
    {
        id: 'uniswap',
        symbol: 'UNI',
        name: 'Uniswap',
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        decimals: 18,
        chainId: 1,
        image: 'https://assets.coingecko.com/coins/images/12504/large/uni.jpg',
    },
    {
        id: 'aave',
        symbol: 'AAVE',
        name: 'Aave',
        address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        decimals: 18,
        chainId: 1,
        image: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png',
    },
    {
        id: 'maker',
        symbol: 'MKR',
        name: 'Maker',
        address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
        decimals: 18,
        chainId: 1,
        image: 'https://assets.coingecko.com/coins/images/1364/large/Mark_Maker.png',
    },
    {
        id: 'compound-governance-token',
        symbol: 'COMP',
        name: 'Compound',
        address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        decimals: 18,
        chainId: 1,
        image: 'https://assets.coingecko.com/coins/images/10775/large/COMP.png',
    },
    {
        id: 'arbitrum',
        symbol: 'ARB',
        name: 'Arbitrum',
        address: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
        decimals: 18,
        chainId: 1,
        image: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg',
    },
    {
        id: 'optimism',
        symbol: 'OP',
        name: 'Optimism',
        address: '0x4200000000000000000000000000000000000042',
        decimals: 18,
        chainId: 1,
        image: 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
    }
];