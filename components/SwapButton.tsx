'use client';

import { useState, useEffect } from 'react';
import { TokenData } from '@/types/token';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/contexts/ToastContext';
import { executeSwap, SwapError } from '@/utils/swap';
import { getReadableError } from '@/utils/errorHandling';

interface SwapButtonProps {
  fromToken: TokenData;
  toToken: TokenData;
  fromAmount: string;
  toAmount: string;
  hasInsufficientBalance: boolean;
  onSuccess?: (txHash: string) => void;
}

export default function SwapButton({ 
  fromToken, 
  toToken, 
  fromAmount, 
  toAmount,
  hasInsufficientBalance,
  onSuccess
}: SwapButtonProps) {
  const { isConnected, provider } = useWallet();
  const { showToast } = useToast();
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSwap = async () => {
    if (!provider || !fromAmount || !toAmount) return;
    
    setIsSwapping(true);
    setError(null);

    try {
      const txHash = await executeSwap(
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        1,
        provider
      );
      
      onSuccess?.(txHash);
      
      showToast(
        <div className="flex flex-col gap-2">
          <div>Swap successful!</div>
          <a 
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            View on Etherscan ↗
          </a>
        </div>,
        'success'
      );
    } catch (error) {
      const swapError = error instanceof SwapError ? error : new SwapError('Unknown error occurred');
      
      if (swapError.code !== 'ACTION_REJECTED') {
        console.warn('Swap failed:', {
          message: swapError.message,
          code: swapError.code,
          reason: swapError.reason
        });
      }

      const readableError = getReadableError(swapError);
      setError(readableError);
      showToast(readableError, 'error');
    } finally {
      setIsSwapping(false);
    }
  };

  if (!isConnected) return null;

  const getButtonText = () => {
    if (isSwapping) return 'Swapping...';
    if (hasInsufficientBalance) return `Insufficient ${fromToken.symbol} balance`;
    if (!fromAmount || !toAmount) return 'Enter an amount';
    if (error) return 'Try Again';
    return `Swap ${fromToken.symbol} to ${toToken.symbol}`;
  };

  return (
    <div className="space-y-2">
      <button 
        onClick={handleSwap}
        disabled={!fromAmount || !toAmount || hasInsufficientBalance || isSwapping}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        <div className="flex items-center justify-center gap-2 font-semibold">
          {isSwapping && (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          <span>{getButtonText()}</span>
        </div>
      </button>

      {error && (
        <div className="text-sm text-red-400 text-center p-3 rounded-xl bg-red-500/5 border border-red-500/10">
          <div className="font-medium mb-1">Transaction Failed</div>
          <div className="opacity-80">{error}</div>
        </div>
      )}
    </div>
  );
}