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
    disconnect: () => Promise<void>;
    provider: ethers.providers.Web3Provider | null;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState('0');
    const [chainId, setChainId] = useState<number | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

    const connect = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        setIsConnecting(true);

        try {
            // Force MetaMask to show the wallet selection screen
            await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }]
            });

            // After permission is granted, get the selected account
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const network = await web3Provider.getNetwork();
            const account = accounts[0];
            const accountBalance = await web3Provider.getBalance(account);

            setProvider(web3Provider);
            setAddress(account);
            setChainId(network.chainId);
            setBalance(ethers.utils.formatEther(accountBalance));
        } catch (error) {
            console.error('Connection error here:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnect = async () => {
        setAddress(null);
        setBalance('0');
        setChainId(null);
        setProvider(null);

        // Clear any cached permissions
        if (window.ethereum && window.ethereum.request) {
            try {
                await window.ethereum.request({
                    method: 'wallet_revokePermissions',
                    params: [{ eth_accounts: {} }]
                });
            } catch (error) {
                console.error('Error revoking permissions:', error);
            }
        }
    };

    // Event listeners for account and chain changes
    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                disconnect();
            } else if (accounts[0] !== address) {
                connect();
            }
        };

        const handleChainChanged = () => {
            window.location.reload();
        };

        const ethereum = window.ethereum;
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);

        return () => {
            if (ethereum) {
                ethereum.removeListener('accountsChanged', handleAccountsChanged);
                ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [address]);

    return (
        <WalletContext.Provider
            value={{
                address,
                balance,
                chainId,
                isConnected: !!address,
                isConnecting,
                connect,
                disconnect,
                provider
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    return useContext(WalletContext);
}