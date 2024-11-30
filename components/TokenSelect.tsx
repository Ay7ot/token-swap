'use client';

import { useState, useEffect } from 'react';
import { TokenData, DEFAULT_TOKENS } from '@/types/token';
import { useWallet } from '@/contexts/WalletContext';
import { getTokenBalance, isValidTokenContract } from '@/utils/tokenBalance';
import Image from 'next/image';

interface TokenSelectProps {
  direction: 'from' | 'to';
  selectedToken: TokenData;
  onTokenSelect: (token: TokenData) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  hasInsufficientBalance?: boolean;
}

export default function TokenSelect({ 
  direction, 
  selectedToken, 
  onTokenSelect,
  amount,
  onAmountChange,
  hasInsufficientBalance
}: TokenSelectProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({});
  const [invalidTokens, setInvalidTokens] = useState<Set<string>>(new Set());
  const { address, provider, isConnected } = useWallet();

  // Fetch balances for all tokens when connected
  useEffect(() => {
    const fetchBalances = async () => {
      if (!isConnected || !address || !provider) return;

      const balances: Record<string, string> = {};
      const invalid = new Set<string>();

      for (const token of DEFAULT_TOKENS) {
        try {
          // Validate token contract first
          const isValid = await isValidTokenContract(token.address, provider);
          if (!isValid) {
            invalid.add(token.address);
            continue;
          }

          const balance = await getTokenBalance(token.address, address, provider);
          balances[token.address] = balance;
        } catch (error) {
          console.warn(`Error fetching balance for token ${token.symbol}:`, error);
          invalid.add(token.address);
        }
      }

      setTokenBalances(balances);
      setInvalidTokens(invalid);
    };

    fetchBalances();
  }, [isConnected, address, provider]);

  const filteredTokens = DEFAULT_TOKENS.filter(token => 
    (token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    !invalidTokens.has(token.address)
  );

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.0001) return '< 0.0001';
    return num.toFixed(4);
  };

  return (
    <div className="relative">
      <div className={`p-3 sm:p-4 rounded-xl bg-dark-blue/20 backdrop-blur-md border transition-all duration-300 
        ${hasInsufficientBalance 
          ? 'border-red-500/50 hover:border-red-500/70' 
          : 'border-white/10 hover:border-primary/30'}`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm text-gray-400">
            {direction === 'from' ? 'You pay' : 'You receive'}
          </span>
          {direction === 'from' && isConnected && (
            <span className={`text-xs sm:text-sm ${hasInsufficientBalance ? 'text-red-400' : 'text-gray-400'}`}>
              Balance: {formatBalance(tokenBalances[selectedToken.address] || '0')}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setIsSelectOpen(true)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-dark-blue/40 hover:bg-dark-blue/60 transition-all duration-300 border border-white/5 hover:border-primary/30 min-w-[100px] sm:min-w-[120px]"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 relative">
              <Image
                src={selectedToken.image}
                alt={selectedToken.symbol}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span className="text-sm sm:text-base font-medium">{selectedToken.symbol}</span>
            <span className="text-gray-400 ml-1">▼</span>
          </button>
          
          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="w-full bg-transparent text-right focus:outline-none text-lg sm:text-xl font-medium"
          />
        </div>

        {hasInsufficientBalance && direction === 'from' && (
          <div className="mt-1 text-sm text-red-400">
            Insufficient {selectedToken.symbol} balance
          </div>
        )}

        {direction === 'to' && selectedToken.current_price && (
          <div className="mt-1 text-right text-sm text-gray-400">
            ≈ ${(parseFloat(amount || '0') * (selectedToken.current_price || 0)).toFixed(2)} USD
          </div>
        )}
      </div>

      {/* Token Selection Modal */}
      {isSelectOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-dark-blue/95 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-4 border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Token</h3>
              <button 
                onClick={() => setIsSelectOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              placeholder="Search token name or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-light-blue/30 border border-white/10 focus:border-primary/50 outline-none mb-4"
            />

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => {
                    onTokenSelect(token);
                    setIsSelectOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-light-blue/30 transition-colors"
                >
                  <div className="w-8 h-8 relative flex-shrink-0">
                    <Image
                      src={token.image}
                      alt={token.symbol}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-gray-400 truncate">{token.name}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {isConnected && tokenBalances[token.address] && (
                      <div className="text-sm text-gray-400">
                        {formatBalance(tokenBalances[token.address])}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}