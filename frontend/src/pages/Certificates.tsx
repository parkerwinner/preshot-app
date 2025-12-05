import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, ArrowLeft, ExternalLink, Loader2, Trophy } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "sonner";

export default function Certificates() {
  const navigate = useNavigate();
  const account = useActiveAccount();
  const [loading, setLoading] = useState(false);

  const badgesContract = import.meta.env.VITE_PRESHOT_BADGES_CONTRACT;
  const credentialsContract = import.meta.env.VITE_PRESHOT_CREDENTIALS_CONTRACT;

  return (
    <DashboardLayout>
      <div className="space-y-6 top-40 relative pb-12">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/courses")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-black">
            <h1 className="text-3xl font-bold">🎓 Your NFT Certificates</h1>
            <p className="text-muted-foreground mt-1">
              Blockchain-verified achievement badges
            </p>
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>NFT Achievement Badges</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Your course completion badges are minted as NFTs on Base
                  Sepolia
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background border">
                <p className="text-sm font-medium mb-1">Wallet Address</p>
                <p className="text-xs text-muted-foreground font-mono break-all">
                  {account?.address || "Not connected"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-background border">
                <p className="text-sm font-medium mb-1">Network</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">Base Sepolia</Badge>
                  <span className="text-xs text-muted-foreground">
                    (Testnet)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    `https://sepolia.basescan.org/address/${badgesContract}`,
                    "_blank"
                  )
                }
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Badges Contract
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    `https://sepolia.basescan.org/address/${credentialsContract}`,
                    "_blank"
                  )
                }
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Credentials Contract
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              How NFT Minting Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Complete a Course</p>
                  <p className="text-sm text-muted-foreground">
                    Finish all modules and pass the quizzes
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Choose Your Region</p>
                  <p className="text-sm text-muted-foreground">
                    Select Global, Africa, or Asia for region-specific metadata
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Mint Your NFT</p>
                  <p className="text-sm text-muted-foreground">
                    Sign the transaction and receive your achievement badge
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">View in Wallet</p>
                  <p className="text-sm text-muted-foreground">
                    Your NFT badge appears in your wallet with IPFS metadata
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge Types */}
        <Card>
          <CardHeader>
            <CardTitle>Available Badge Types</CardTitle>
            <p className="text-sm text-muted-foreground">
              Badges are automatically determined by the smart contract based on
              your achievements
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-500/10 to-transparent">
                <div className="text-2xl mb-2">🎯</div>
                <p className="font-semibold">Assessed Badge</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Awarded on first assessment completion
                </p>
                <Badge variant="secondary" className="mt-2">
                  Type 1
                </Badge>
              </div>
              <div className="p-4 rounded-lg border bg-gradient-to-br from-green-500/10 to-transparent">
                <div className="text-2xl mb-2">✅</div>
                <p className="font-semibold">Ready Badge</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Awarded for 70+ readiness score
                </p>
                <Badge variant="secondary" className="mt-2">
                  Type 2
                </Badge>
              </div>
              <div className="p-4 rounded-lg border bg-gradient-to-br from-purple-500/10 to-transparent">
                <div className="text-2xl mb-2">🏆</div>
                <p className="font-semibold">Certified Badge</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Awarded for completing 3+ courses
                </p>
                <Badge variant="secondary" className="mt-2">
                  Type 3
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="border-2 border-primary">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 mx-auto text-primary mb-3" />
            <h3 className="font-bold text-lg mb-2">Start Earning NFT Badges</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete courses to mint your blockchain-verified achievement
              badges
            </p>
            <Button onClick={() => navigate("/courses")} size="lg">
              <Award className="h-4 w-4 mr-2" />
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
