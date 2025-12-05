import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Award, Loader2, Trophy } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "sonner";
import { useBlockchainSubmit } from "@/hooks/useMCP";

interface MintNFTModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  courseTitle: string;
  onSuccess?: () => void;
}

export function MintNFTModal({
  open,
  onOpenChange,
  courseId,
  courseTitle,
  onSuccess,
}: MintNFTModalProps) {
  const account = useActiveAccount();
  const { submitToBlockchain, loading } = useBlockchainSubmit();
  const [region, setRegion] = useState<string>("0");
  const [manualMode, setManualMode] = useState(false);
  const [manualMintData, setManualMintData] = useState<{
    ipfsUrl: string;
    readinessScore: number;
    region: number;
  } | null>(null);

  const handleManualMint = async (
    ipfsUrl: string,
    readinessScore: number,
    regionParam: number
  ) => {
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const { prepareContractCall, sendTransaction, getContract } =
        await import("thirdweb");
      const { baseSepolia } = await import("thirdweb/chains");
      const { client } = await import("@/providers/ThirdwebProvider");

      // FIXED: Use lowercase address to bypass checksum validation
      // and proper type assertion for Thirdweb v5
      const contractAddress =
        "0xef18625f583f2362390a8edd637f707f62358669" as `0x${string}`;

      // Get the contract
      const contract = getContract({
        client,
        chain: baseSepolia,
        address: contractAddress,
      });

      // Prepare the transaction to call submitData function
      const transaction = prepareContractCall({
        contract,
        method:
          "function submitData(string memory ipfsUrl, uint256 readinessScore) external",
        params: [ipfsUrl, BigInt(readinessScore)],
      });

      toast.loading("Confirm transaction in your wallet...");

      // Send the transaction
      const result = await sendTransaction({
        transaction,
        account,
      });

      toast.dismiss();
      toast.success(
        <div>
          <p className="font-semibold">NFT Badge Minted Successfully! 🎉</p>
          <a
            href={`https://sepolia.basescan.org/tx/${result.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline"
          >
            View Transaction
          </a>
        </div>,
        { duration: 6000 }
      );

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Manual minting error:", error);
      toast.dismiss();
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to mint NFT manually. Please try again."
      );
    }
  };

  const handleMint = async () => {
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }

    // If in manual mode, directly mint with user's wallet
    if (manualMode && manualMintData) {
      await handleManualMint(
        manualMintData.ipfsUrl,
        manualMintData.readinessScore,
        manualMintData.region
      );
      return;
    }

    try {
      // Generate signature for blockchain submission
      const message = `Mint NFT Badge for course: ${courseId}\\nRegion: ${region}\\nAddress: ${account.address}`;

      let signature: string;
      try {
        signature = await account.signMessage({ message });
      } catch (signError) {
        console.error("Signature error:", signError);
        toast.error("Failed to sign message. Please try again.");
        return;
      }

      // Prepare assessment data for blockchain submission
      const assessmentData = {
        courseId,
        courseTitle,
        completedAt: new Date().toISOString(),
        userAddress: account.address,
        region: parseInt(region),
        readinessScore: 100,
      };

      toast.loading("Minting your NFT badge via MCP server...");

      // Try MCP server submission first
      const result = await submitToBlockchain({
        userAddress: account.address,
        assessmentData,
        signature,
      });

      toast.dismiss();

      // Check if manual submission is needed
      if (!result.success && (result as any).ipfsUrl) {
        console.log("[Mint] AI wallet failed, switching to manual mode");

        // Set manual mode and store the data
        setManualMode(true);
        setManualMintData({
          ipfsUrl: (result as any).ipfsUrl,
          readinessScore: (result as any).readinessScore || 100,
          region: (result as any).region || parseInt(region),
        });

        toast.info(
          "AI wallet is out of gas. Click 'Manual Mint NFT' to mint with your own wallet.",
          { duration: 5000 }
        );
        return;
      }

      if (result.success) {
        toast.success(
          <div>
            <p className="font-semibold">NFT Badge Minted Successfully! 🎉</p>
            {result.txHash && (
              <a
                href={`https://sepolia.basescan.org/tx/${result.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline"
              >
                View Transaction
              </a>
            )}
          </div>,
          { duration: 6000 }
        );
        onOpenChange(false);
        onSuccess?.();
      } else {
        throw new Error(result.message || "Minting failed");
      }
    } catch (error) {
      console.error("Minting error:", error);
      toast.dismiss();
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to mint NFT. Please try again."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            🎉 Congratulations!
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            You've completed <strong>{courseTitle}</strong>
            <br />
            Mint your NFT achievement badge on the blockchain
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Region Selection */}
          <div className="space-y-2">
            <Label htmlFor="region">Select Your Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger id="region">
                <SelectValue placeholder="Choose region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">
                  <span className="flex items-center gap-2">🌍 Global</span>
                </SelectItem>
                <SelectItem value="1">
                  <span className="flex items-center gap-2">🌍 Africa</span>
                </SelectItem>
                <SelectItem value="2">
                  <span className="flex items-center gap-2">🌏 Asia</span>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Your NFT metadata will include region-specific information
            </p>
          </div>

          {/* Info Box */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>ℹ️ How it works:</strong>
              <br />
              Preshot system automatically determines your badge type based on
              achievements. You'll mint an NFT that lives in your wallet
              forever!
            </p>
          </div>

          {/* Wallet Info */}
          {account && (
            <div className="text-xs text-muted-foreground">
              <p className="mb-1">Minting to:</p>
              <p className="font-mono bg-muted p-2 rounded break-all">
                {account.address}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleMint}
              className={
                manualMode
                  ? "flex-1 bg-orange-600 hover:bg-orange-700"
                  : "flex-1"
              }
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {manualMode ? "Minting..." : "Minting..."}
                </>
              ) : manualMode ? (
                <>
                  <Award className="h-4 w-4 mr-2" />
                  Manual Mint NFT (You Pay Gas)
                </>
              ) : (
                <>
                  <Award className="h-4 w-4 mr-2" />
                  Mint NFT
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Also export as default to fix module resolution issues
export default MintNFTModal;
