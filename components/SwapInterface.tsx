'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { getTokenPrice } from '@/utils/prices';
import { getTokenBalance } from '@/utils/tokenBalance';
import { DEFAULT_TOKENS } from '@/types/token';
import ConnectWallet from './ConnectWallet';
import TokenSelect from './TokenSelect';
import SwapButton from './SwapButton';

export default function SwapInterface() {
    const { provider, isConnected, address } = useWallet();
    const [fromToken, setFromToken] = useState(DEFAULT_TOKENS[0]);
    const [toToken, setToToken] = useState(DEFAULT_TOKENS[1]);
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [activeInput, setActiveInput] = useState<'from' | 'to'>('from');
    const [balance, setBalance] = useState('0');
    const [hasInsufficientBalance, setHasInsufficientBalance] = useState(false);

    // Fetch and update balance when token or address changes
    useEffect(() => {
        const updateBalance = async () => {
            if (!isConnected || !address || !provider || !fromToken) {
                setBalance('0');
                return;
            }
            const newBalance = await getTokenBalance(fromToken.address, address, provider);
            setBalance(newBalance);
        };

        updateBalance();
    }, [fromToken, address, isConnected, provider]);

    // Check for insufficient balance
    useEffect(() => {
        if (!isConnected || !fromAmount) {
            setHasInsufficientBalance(false);
            return;
        }

        const fromAmountNum = parseFloat(fromAmount);
        const balanceNum = parseFloat(balance);

        setHasInsufficientBalance(fromAmountNum > balanceNum);
    }, [fromAmount, balance, isConnected]);

    useEffect(() => {
        const updatePrice = async () => {
            if (!provider || !fromToken || !toToken) {
                return;
            }

            const amount = activeInput === 'from' ? fromAmount : toAmount;
            if (!amount || parseFloat(amount) === 0) {
                if (activeInput === 'from') {
                    setToAmount('');
                } else {
                    setFromAmount('');
                }
                return;
            }

            try {
                const price = await getTokenPrice(
                    fromToken,
                    toToken,
                    amount,
                    activeInput,
                    provider
                );

                if (activeInput === 'from') {
                    setToAmount(price);
                } else {
                    setFromAmount(price);
                }
            } catch (error) {
                console.error('Error updating price:', error);
            }
        };

        updatePrice();
    }, [fromToken, toToken, fromAmount, toAmount, activeInput, provider]);

    const handleFromAmountChange = (amount: string) => {
        setActiveInput('from');
        setFromAmount(amount);
    };

    const handleToAmountChange = (amount: string) => {
        setActiveInput('to');
        setToAmount(amount);
    };

    const handleSwapTokens = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    return (
        <div className="min-h-screen bg-gradient-dark px-4 py-6 sm:p-4 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Animated gradient orbs - reduced size on mobile */}
                <div className="absolute top-[-5%] left-[-5%] w-[30%] sm:w-[40%] h-[30%] sm:h-[40%] rounded-full bg-primary/20 blur-[100px] animate-gradient-xy" />
                <div className="absolute top-[-5%] right-[-5%] w-[30%] sm:w-[40%] h-[30%] sm:h-[40%] rounded-full bg-secondary/20 blur-[100px] animate-gradient-xy" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[30%] sm:w-[40%] h-[30%] sm:h-[40%] rounded-full bg-secondary/20 blur-[100px] animate-gradient-xy" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] sm:w-[40%] h-[30%] sm:h-[40%] rounded-full bg-primary/20 blur-[100px] animate-gradient-xy" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#4F46E5/2_1px,transparent_1px),linear-gradient(to_bottom,#4F46E5/2_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000,transparent)]"
                    style={{ opacity: 0.1 }}
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 bg-dark-blue/20 backdrop-blur-xl rounded-3xl p-4 sm:p-6 w-full max-w-md border border-white/10 shadow-xl">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary text-transparent bg-clip-text">
                        Swap Tokens
                    </h1>
                    <ConnectWallet />
                </div>

                <div className="space-y-2">
                    <TokenSelect
                        direction="from"
                        selectedToken={fromToken}
                        onTokenSelect={setFromToken}
                        amount={fromAmount}
                        onAmountChange={handleFromAmountChange}
                        hasInsufficientBalance={hasInsufficientBalance}
                    />

                    {/* Swap direction button */}
                    <div className="flex justify-center -my-2 z-10">
                        <button
                            onClick={handleSwapTokens}
                            className="p-2 rounded-full bg-dark-blue/50 border border-white/10 hover:border-primary/50 transition-all duration-300 group"
                        >
                            <svg
                                className="w-6 h-6 rotate-0 group-hover:rotate-180 transition-transform duration-300 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                        </button>
                    </div>

                    <TokenSelect
                        direction="to"
                        selectedToken={toToken}
                        onTokenSelect={setToToken}
                        amount={toAmount}
                        onAmountChange={handleToAmountChange}
                    />

                    <SwapButton
                        fromToken={fromToken}
                        toToken={toToken}
                        fromAmount={fromAmount}
                        toAmount={toAmount}
                        hasInsufficientBalance={hasInsufficientBalance}
                    />
                </div>
            </div>
        </div>
    );
}