'use client';

import { useState, useRef } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

export default function ConnectWallet() {
    const { address, balance, chainId, isConnected, isConnecting, connect, disconnect } = useWallet();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(menuRef, () => setIsMenuOpen(false));

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const handleCopyAddress = async () => {
        if (!address) return;

        try {
            await navigator.clipboard.writeText(address);
            setIsCopied(true);

            // Reset copy state after 2 seconds
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy address:', err);
        }
    };

    const handleDisconnect = async () => {
        disconnect();
        setIsMenuOpen(false);
    };

    const getNetworkName = (chainId: number) => {
        switch (chainId) {
            case 1:
                return 'Ethereum';
            case 5:
                return 'Goerli';
            default:
                return 'Unknown Network';
        }
    };

    if (!isConnected) {
        return (
            <button
                onClick={connect}
                disabled={isConnecting}
                className="px-4 py-2 rounded-xl bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white font-semibold disabled:opacity-50 flex items-center gap-2"
            >
                {isConnecting ? (
                    <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Connecting...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 15.75h.008v.008H12v-.008zm0-3.75h.008v.008H12V12z" />
                        </svg>
                        <span>Connect Wallet</span>
                    </>
                )}
            </button>
        );
    }

    return (
        <div className="relative z-40" ref={menuRef}>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="px-4 py-2 rounded-xl bg-dark-blue/40 hover:bg-dark-blue/60 transition-all duration-300 border border-white/5 hover:border-primary/30"
            >
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <span>{shortenAddress(address!)}</span>
                </div>
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-dark-blue/95 border border-white/10 shadow-xl backdrop-blur-xl p-4 space-y-4 z-50">
                    <div className="space-y-2">
                        <div className="text-sm text-gray-400">Account</div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">{shortenAddress(address!)}</div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCopyAddress}
                                    className={`p-1.5 rounded-lg transition-all duration-200 relative group
                                        ${isCopied
                                            ? 'bg-green-500/20 text-green-500'
                                            : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                        }`}
                                    title={isCopied ? 'Copied!' : 'Copy address'}
                                >
                                    {isCopied ? (
                                        <svg
                                            className="w-4 h-4 animate-fade-in"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                    )}

                                    {/* Tooltip */}
                                    <span
                                        className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded bg-dark-blue border border-white/10 whitespace-nowrap
                                            ${isCopied
                                                ? 'opacity-100 translate-y-0'
                                                : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                                            }
                                            transition-all duration-200`}
                                    >
                                        {isCopied ? 'Copied!' : 'Copy address'}
                                    </span>
                                </button>
                                <a
                                    href={`https://etherscan.io/address/${address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                                    title="View on Etherscan"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm text-gray-400">Balance</div>
                        <div className="font-medium flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z M9 12h6 M12 9v6" />
                            </svg>
                            {parseFloat(balance).toFixed(4)} ETH
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm text-gray-400">Network</div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{chainId ? getNetworkName(chainId) : 'Unknown Network'}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleDisconnect}
                        className="w-full px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    );
}