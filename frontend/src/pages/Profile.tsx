import { useActiveAccount } from "thirdweb/react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { User, Wallet } from "lucide-react";

export default function Profile() {
  const account = useActiveAccount();

  if (!account) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 top-40 relative">
          <Wallet className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Please connect your wallet to view your profile
          </p>
          <ConnectWallet />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-3xl mx-auto top-40 relative pb-12">
        <div className="text-black">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-black  mt-2">Your Web3 wallet information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Wallet Information
            </CardTitle>
            <CardDescription>Your connected wallet details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Wallet Address
              </p>
              <p className="text-lg font-mono bg-muted p-3 rounded-md break-all">
                {account.address}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Network
              </p>
              <p className="text-lg">Base Network, SDK: Thirdweb</p>
            </div>

            <div className="pt-4">
              <ConnectWallet />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Web3 Profile Coming Soon
                </h3>
                <p className="text-sm text-blue-700">
                  In the future, you'll be able to store your profile data
                  on-chain or via IPFS for a truly decentralized experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
