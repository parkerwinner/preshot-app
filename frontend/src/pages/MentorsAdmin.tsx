import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Search,
  TrendingUp,
  UserCheck,
  MessageSquare,
  Star,
  Award,
  Loader2,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for development
const mockUsers = [
  {
    id: '1',
    address: '0x1234...5678',
    full_name: 'John Doe',
    email: 'john@example.com',
    readinessScore: 85,
    latestAssessment: { id: '1', created_at: new Date().toISOString() },
  },
  {
    id: '2',
    address: '0xabcd...efgh',
    full_name: 'Jane Smith',
    email: 'jane@example.com',
    readinessScore: 72,
    latestAssessment: { id: '2', created_at: new Date().toISOString() },
  },
];

const MentorsAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const getStatusBadge = (score: number) => {
    if (score >= 80)
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20">
          Excellent
        </Badge>
      );
    if (score >= 60)
      return (
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20">
          Good
        </Badge>
      );
    if (score >= 40)
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20">
          Fair
        </Badge>
      );
    return (
      <Badge className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">
        Needs Improvement
      </Badge>
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const submitComment = () => {
    if (!selectedUser || !comment.trim()) return;

    setSubmittingComment(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Comment added successfully');
      setComment('');
      setSelectedUser(null);
      setSubmittingComment(false);
    }, 1000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Monitor and guide user progress
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Active participants
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Readiness
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.length > 0
                  ? Math.round(
                      users.reduce((acc, u) => acc + u.readinessScore, 0) /
                        users.length
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Overall progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                High Performers
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.readinessScore >= 80).length}
              </div>
              <p className="text-xs text-muted-foreground">Score ≥ 80%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Need Support
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.readinessScore < 60).length}
              </div>
              <p className="text-xs text-muted-foreground">Score &lt; 60%</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View and manage all users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Wallet Address</TableHead>
                    <TableHead>Readiness Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Assessment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-muted-foreground">No users found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name || 'N/A'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {user.address}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{
                                  width: `${user.readinessScore}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold">
                              {user.readinessScore}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(user.readinessScore)}
                        </TableCell>
                        <TableCell>
                          {user.latestAssessment
                            ? new Date(
                                user.latestAssessment.created_at
                              ).toLocaleDateString()
                            : 'No assessment'}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedUser(user)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Comment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Comment Modal */}
        {selectedUser && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>Add Comment for {selectedUser.full_name}</CardTitle>
              <CardDescription>
                Provide feedback and guidance to help them improve
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Current Readiness Score: {selectedUser.readinessScore}%
                </p>
                {getStatusBadge(selectedUser.readinessScore)}
              </div>
              <Textarea
                placeholder="Enter your feedback and recommendations..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  onClick={submitComment}
                  disabled={submittingComment || !comment.trim()}
                >
                  {submittingComment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4" />
                      Submit Comment
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(null);
                    setComment('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MentorsAdmin;
