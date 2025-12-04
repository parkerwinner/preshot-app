// Wallet connection component for Preshot
import { ConnectButton, useActiveAccount, useDisconnect } from 'thirdweb/react';
import { client, activeChain } from '../../providers/ThirdwebProvider';
import { Button } from '../ui/button';
import { LogOut, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../../config/admins';

export function ConnectWallet() {
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  const handleDisconnect = async () => {
    await disconnect();
    navigate('/');
  };

  if (account) {
    const userAddress = account.address;
    const adminStatus = isAdmin(userAddress);
    
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono">
            {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </span>
          {adminStatus && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
              Admin
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </Button>
      </div>
    );
  }

  return (
    <ConnectButton
      client={client}
      chain={activeChain}
      connectButton={{
        label: 'Connect Wallet',
        className: 'bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors',
      }}
      connectModal={{
        title: 'Connect to Preshot',
        titleIcon: '',
        showThirdwebBranding: false,
        size: 'compact',
      }}
      wallets={[]}
    />
  );
}
