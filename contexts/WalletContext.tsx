'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
    address: string | null;
    balance: string;
    chainId: number | null;
    isConnected: boolean;
    isConnecting: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
    provider: ethers.providers.Web3Provider | null;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<string>('0');
    const [chainId, setChainId] = useState<number | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

    useEffect(() => {
        // Check if wallet was previously connected
        const checkConnection = async () => {
            if (typeof window !== 'undefined' && window.ethereum?.selectedAddress) {
                connect();
            }
        };
        checkConnection();
    }, []);

    const connect = async () => {
        if (typeof window === 'undefined' || !window.ethereum) {
            alert('Please install MetaMask or another Web3 wallet');
            return;
        }

        setIsConnecting(true);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum as any);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            const network = await provider.getNetwork();

            setProvider(provider);
            setAddress(address);
            setBalance(ethers.utils.formatEther(balance));
            setChainId(network.chainId);
            setIsConnected(true);

            // Setup event listeners
            if (window.ethereum?.on) {
                window.ethereum.on('accountsChanged', handleAccountsChanged);
                window.ethereum.on('chainChanged', handleChainChanged);
                window.ethereum.on('disconnect', handleDisconnect);
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnect = () => {
        setAddress(null);
        setBalance('0');
        setChainId(null);
        setIsConnected(false);
        setProvider(null);

        // Remove event listeners
        if (window.ethereum?.removeListener) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
            window.ethereum.removeListener('disconnect', handleDisconnect);
        }
    };

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
            disconnect();
        } else {
            setAddress(accounts[0]);
            updateBalance(accounts[0]);
        }
    };

    const handleChainChanged = (_chainId: string) => {
        window.location.reload();
    };

    const handleDisconnect = () => {
        disconnect();
    };

    const updateBalance = async (address: string) => {
        if (provider) {
            const balance = await provider.getBalance(address);
            setBalance(ethers.utils.formatEther(balance));
        }
    };

    return (
        <WalletContext.Provider
            value={{
                address,
                balance,
                chainId,
                isConnected,
                isConnecting,
                connect,
                disconnect,
                provider,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => useContext(WalletContext);