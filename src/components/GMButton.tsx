import React from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { Sun } from 'lucide-react';
import { formatAttributionTransactionData } from '../lib/erc8021';

export const GM_CONTRACT_ADDRESS = '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3';

export const GMButton = () => {
    const { isConnected } = useAccount();
    const { sendTransaction, isPending, isSuccess } = useSendTransaction();

    const handleGM = () => {
        sendTransaction({
            to: GM_CONTRACT_ADDRESS,
            value: 0n,
            data: formatAttributionTransactionData('say_gm'),
        });
    };

    if (!isConnected) return null;

    return (
        <button 
            onClick={handleGM}
            disabled={isPending}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
        >
            <Sun className="w-4 h-4" />
            {isPending ? 'Sending...' : isSuccess ? 'GM Sent!' : 'Say GM'}
        </button>
    );
};
