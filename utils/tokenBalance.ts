import { ethers } from 'ethers';
import { TokenData } from '@/types/token';

// Basic ERC20 ABI for balanceOf
const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
];

export async function getTokenBalance(
    tokenAddress: string,
    userAddress: string,
    provider: ethers.providers.Web3Provider
): Promise<string> {
    try {
        // Handle native ETH
        if (tokenAddress === 'ETH') {
            const balance = await provider.getBalance(userAddress);
            return ethers.utils.formatEther(balance);
        }

        // Validate addresses
        if (!ethers.utils.isAddress(tokenAddress) || !ethers.utils.isAddress(userAddress)) {
            console.warn('Invalid address provided to getTokenBalance');
            return '0';
        }

        // Create contract instance
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

        // Get balance and decimals in parallel
        const [balance, decimals] = await Promise.all([
            tokenContract.balanceOf(userAddress).catch(() => ethers.BigNumber.from(0)),
            tokenContract.decimals().catch(() => 18) // Default to 18 decimals if call fails
        ]);
        
        return ethers.utils.formatUnits(balance, decimals);
    } catch (error) {
        // Log error but don't crash the app
        console.warn('Error fetching token balance:', {
            tokenAddress,
            userAddress,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return '0';
    }
}

// Helper function to validate token contract
export async function isValidTokenContract(
    tokenAddress: string,
    provider: ethers.providers.Web3Provider
): Promise<boolean> {
    try {
        if (tokenAddress === 'ETH') return true;
        if (!ethers.utils.isAddress(tokenAddress)) return false;

        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        const code = await provider.getCode(tokenAddress);
        
        // Check if address has contract code
        if (code === '0x') return false;

        // Try to call basic ERC20 functions
        await Promise.all([
            tokenContract.decimals(),
            tokenContract.balanceOf(ethers.constants.AddressZero)
        ]);

        return true;
    } catch {
        return false;
    }
}