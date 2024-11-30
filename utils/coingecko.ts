const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export interface CoinGeckoToken {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
}

export async function getTokenData(tokenId: string): Promise<CoinGeckoToken | null> {
    try {
        const response = await fetch(
            `${COINGECKO_API_BASE}/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching token data:', error);
        return null;
    }
}

export const COMMON_TOKENS = [
    {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        address: 'ETH',
        decimals: 18,
        chainId: 1,
    },
    {
        id: 'usd-coin',
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6,
        chainId: 1,
    },
    {
        id: 'tether',
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6,
        chainId: 1,
    },
    {
        id: 'wrapped-bitcoin',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        decimals: 8,
        chainId: 1,
    },
    // Add more tokens as needed
];