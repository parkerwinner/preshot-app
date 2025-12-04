import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  TrendingUp,
  UserCheck,
  MessageSquare,
  Star,
  Award,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// Admin Mentor Dashboard Component
function AdminMentorDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Fetch all users with their profiles and latest assessment
      const { data: profiles, error: profilesError } = await supabase
        .from("campprofiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch assessments for each user
      const usersWithData = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: assessments } = await supabase
            .from("assessments")
            .select("*")
            .eq("user_id", profile.id)
            .order("created_at", { ascending: false })
            .limit(1);

          return {
            ...profile,
            latestAssessment: assessments?.[0] || null,
            readinessScore: assessments?.[0]?.readiness_score || 0,
          };
        })
      );

      setUsers(usersWithData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!selectedUser || !comment.trim()) return;

    setSubmittingComment(true);
    try {
      const { error } = await supabase.from("mentor_comments").insert({
        user_id: selectedUser.id,
        assessment_id: selectedUser.latestAssessment?.id,
        comment: comment,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully",
      });

      setComment("");
      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (score: number) => {
    if (score >= 80)
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
          Excellent
        </Badge>
      );
    if (score >= 60)
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
          Good
        </Badge>
      );
    if (score >= 40)
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
          Fair
        </Badge>
      );
    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
        Needs Improvement
      </Badge>
    );
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
      <div className="space-y-8 top-40 relative pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-black">
              <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
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

        {/* Search */}
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
                placeholder="Search by name or email..."
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
                    <TableHead>Email</TableHead>
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
                          {user.full_name || "N/A"}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
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
                            : "No assessment"}
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
                  className="bg-blue-600 hover:bg-blue-700"
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
                    setComment("");
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
}

// Regular User Mentor List Component
function UserMentorList() {
  const mentors = [
    {
      id: 1,
      name: "Dr. Amina Okonkwo",
      title: "Rhodes Scholar & Policy Advisor",
      expertise: ["Rhodes Scholarship", "Public Policy", "Leadership"],
      bio: "Former Rhodes Scholar with 10+ years experience in international development and policy.",
      availability: "Available",
      rating: 4.9,
    },
    {
      id: 2,
      name: "Prof. Kwame Mensah",
      title: "Chevening Alumnus & Entrepreneur",
      expertise: ["Chevening", "Entrepreneurship", "Innovation"],
      bio: "Chevening Scholar and successful tech entrepreneur mentoring the next generation.",
      availability: "Limited",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Dr. Fatima Hassan",
      title: "Fulbright Scholar & Researcher",
      expertise: ["Fulbright", "Research", "STEM"],
      bio: "Fulbright Scholar specializing in STEM education and research methodology.",
      availability: "Available",
      rating: 5.0,
    },
    {
      id: 4,
      name: "Mr. Chidi Nwosu",
      title: "Mandela Washington Fellow",
      expertise: ["YALI", "Social Impact", "Community Development"],
      bio: "Young African Leaders Initiative fellow focused on social entrepreneurship.",
      availability: "Available",
      rating: 4.7,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 top-40 relative pb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100">
            <Users className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Find a Mentor</h1>
            <p className="text-muted-foreground mt-1">
              Connect with experienced fellows who can guide your journey
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {mentors.map((mentor) => (
            <Card
              key={mentor.id}
              className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{mentor.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {mentor.title}
                    </CardDescription>
                  </div>
                  <Badge
                    className={
                      mentor.availability === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {mentor.availability}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{mentor.bio}</p>

                <div>
                  <p className="text-sm font-semibold mb-2">Expertise:</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">
                      {mentor.rating}
                    </span>
                    <span className="text-sm text-muted-foreground">/5.0</span>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request Mentorship
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <CardHeader>
            <CardTitle>Become a Mentor</CardTitle>
            <CardDescription>
              Share your experience and help others succeed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you've successfully completed a fellowship or scholarship
              program, consider becoming a mentor to guide the next generation
              of African leaders.
            </p>
            <Button variant="outline" className="border-purple-300">
              Apply to Mentor
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// Main Component - just show user list for now
export default function Mentors() {
  // For now, just show the user mentor list
  // Admin functionality can be added later with on-chain roles
  return <UserMentorList />;
}
