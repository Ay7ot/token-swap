import { ethers } from 'ethers';
import { TokenData } from '@/types/token';

const UNISWAP_V2_ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const ROUTER_ABI = [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts)',
];

export async function getTokenPrice(
    fromToken: TokenData,
    toToken: TokenData,
    amount: string,
    direction: 'from' | 'to',
    provider: ethers.providers.Web3Provider
): Promise<string> {
    if (!amount || parseFloat(amount) === 0) return '0';

    try {
        const router = new ethers.Contract(UNISWAP_V2_ROUTER, ROUTER_ABI, provider);
        const path = getTokenPath(fromToken, toToken);
        const parsedAmount = parseAmount(amount, direction === 'from' ? fromToken : toToken);

        if (direction === 'from') {
            const amounts = await router.getAmountsOut(parsedAmount, path);
            return formatAmount(amounts[amounts.length - 1], toToken);
        } else {
            const amounts = await router.getAmountsIn(parsedAmount, path);
            return formatAmount(amounts[0], fromToken);
        }
    } catch (error) {
        console.error('Error getting price:', error);
        return '0';
    }
}

function getTokenPath(fromToken: TokenData, toToken: TokenData): string[] {
    const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

    if (fromToken.address === 'ETH') {
        return [WETH, toToken.address];
    }
    if (toToken.address === 'ETH') {
        return [fromToken.address, WETH];
    }

    // Use WETH as intermediary for token-to-token swaps
    return [fromToken.address, WETH, toToken.address];
}

function parseAmount(amount: string, token: TokenData): ethers.BigNumber {
    return ethers.utils.parseUnits(amount, token.decimals);
}

function formatAmount(amount: ethers.BigNumber, token: TokenData): string {
    return ethers.utils.formatUnits(amount, token.decimals);
}