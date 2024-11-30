import { ethers } from 'ethers';
import { TokenData } from '@/types/token';

const UNISWAP_V2_ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const ROUTER_ABI = [
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
    'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
];

const ERC20_ABI = [
    'function approve(address spender, uint256 amount) public returns (bool)',
    'function allowance(address owner, address spender) public view returns (uint256)',
];

export class SwapError extends Error {
  code?: string;
  reason?: string;

  constructor(message: string, code?: string, reason?: string) {
    super(message);
    this.code = code;
    this.reason = reason;
    this.name = 'SwapError';
  }
}

export async function executeSwap(
    fromToken: TokenData,
    toToken: TokenData,
    fromAmount: string,
    toAmount: string,
    slippage: number,
    provider: ethers.providers.Web3Provider
): Promise<string> {
    try {
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        const router = new ethers.Contract(UNISWAP_V2_ROUTER, ROUTER_ABI, signer);
        const path = getTokenPath(fromToken, toToken);
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
        const minAmountOut = calculateMinAmountOut(toAmount, slippage, toToken.decimals);

        // Handle approval for ERC20 tokens
        if (fromToken.address !== 'ETH') {
            await handleTokenApproval(
                fromToken,
                fromAmount,
                account,
                UNISWAP_V2_ROUTER,
                provider
            );
        }

        // Execute the swap based on token types
        let tx;
        if (fromToken.address === 'ETH') {
            tx = await router.swapExactETHForTokens(
                minAmountOut,
                path,
                account,
                deadline,
                {
                    value: ethers.utils.parseEther(fromAmount),
                    gasLimit: 250000,
                }
            );
        } else if (toToken.address === 'ETH') {
            const amountIn = ethers.utils.parseUnits(fromAmount, fromToken.decimals);
            tx = await router.swapExactTokensForETH(
                amountIn,
                minAmountOut,
                path,
                account,
                deadline,
                { gasLimit: 250000 }
            );
        } else {
            const amountIn = ethers.utils.parseUnits(fromAmount, fromToken.decimals);
            tx = await router.swapExactTokensForTokens(
                amountIn,
                minAmountOut,
                path,
                account,
                deadline,
                { gasLimit: 250000 }
            );
        }

        return tx.hash;
    } catch (error: any) {
        // Wrap the error in our custom SwapError
        throw new SwapError(
            error.message,
            error.code,
            error.reason
        );
    }
}

async function handleTokenApproval(
    token: TokenData,
    amount: string,
    owner: string,
    spender: string,
    provider: ethers.providers.Web3Provider
): Promise<void> {
    const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider.getSigner());
    const amountToApprove = ethers.utils.parseUnits(amount, token.decimals);

    const currentAllowance = await tokenContract.allowance(owner, spender);
    if (currentAllowance.lt(amountToApprove)) {
        const tx = await tokenContract.approve(spender, amountToApprove);
        await tx.wait();
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
    return [fromToken.address, WETH, toToken.address];
}

function calculateMinAmountOut(
    amount: string,
    slippage: number,
    decimals: number
): ethers.BigNumber {
    const parsedAmount = ethers.utils.parseUnits(amount, decimals);
    const slippageFactor = 100 - slippage;
    return parsedAmount.mul(slippageFactor).div(100);
}