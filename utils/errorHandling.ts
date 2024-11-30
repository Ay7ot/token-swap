interface Web3Error extends Error {
    code?: string | number;
    reason?: string;
    action?: string;
    transaction?: any;
  }
  
  export function getReadableError(error: Web3Error): string {
    // User rejected errors
    if (
      error.code === 'ACTION_REJECTED' ||
      error.code === 4001 ||
      error.message.includes('user rejected transaction')
    ) {
      return 'Transaction was rejected';
    }
  
    // Slippage errors
    if (error.message.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
      return 'Price impact too high. Try increasing slippage tolerance';
    }
  
    // Insufficient balance errors
    if (
      error.message.includes('insufficient funds') ||
      error.message.includes('INSUFFICIENT_BALANCE')
    ) {
      return 'Insufficient balance for this transaction';
    }
  
    // Gas errors
    if (error.message.includes('gas required exceeds allowance')) {
      return 'Transaction would fail. Try increasing gas limit';
    }
  
    // Network errors
    if (error.message.includes('network changed') || error.message.includes('disconnected')) {
      return 'Network connection error. Please check your wallet connection';
    }
  
    // Contract errors
    if (error.message.includes('TRANSFER_FAILED')) {
      return 'Token transfer failed. Please try again';
    }
  
    // Approval errors
    if (error.message.includes('APPROVAL_FAILED')) {
      return 'Token approval failed. Please try again';
    }
  
    // RPC errors
    if (error.message.includes('Internal JSON-RPC error')) {
      try {
        const jsonError = JSON.parse(error.message);
        return jsonError.message || 'Transaction failed';
      } catch {
        return 'Transaction failed. Please try again';
      }
    }
  
    // Fallback for unknown errors
    return 'Something went wrong. Please try again';
  }