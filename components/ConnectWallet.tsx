'use client';

import { useState, useRef } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

export default function ConnectWallet() {
    const { address, balance, chainId, isConnected, isConnecting, connect, disconnect } = useWallet();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(menuRef, () => setIsMenuOpen(false));

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
                className="px-4 py-2 rounded-xl bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white font-semibold disabled:opacity-50"
            >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
        );
    }

    return (
        <div className="relative z-50" ref={menuRef}>
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
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-dark-blue/95 border border-white/10 shadow-xl backdrop-blur-xl p-4 space-y-4 z-[60]">
                    <div className="space-y-2">
                        <div className="text-sm text-gray-400">Account</div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">{shortenAddress(address!)}</div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigator.clipboard.writeText(address!)}
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                                    title="Copy address"
                                >
                                    📋
                                </button>
                                <a
                                    href={`https://etherscan.io/address/${address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                                    title="View on Etherscan"
                                >
                                    ↗️
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm text-gray-400">Balance</div>
                        <div className="font-medium">{parseFloat(balance).toFixed(4)} ETH</div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm text-gray-400">Network</div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-400" />
                            <span>{chainId ? getNetworkName(chainId) : 'Unknown Network'}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            disconnect();
                            setIsMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                    >
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    );
}