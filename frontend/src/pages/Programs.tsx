import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  ExternalLink,
  Calendar,
  MapPin,
  Award,
  Loader2,
  Trophy,
} from 'lucide-react';
import { usePrograms } from '@/hooks/useMCP';
import { toast } from 'sonner';

export default function Programs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const { matchPrograms, loading, data } = usePrograms();

  // Fetch programs on mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      await matchPrograms({
        type: typeFilter === 'all' ? undefined : typeFilter.toLowerCase(),
        region: regionFilter === 'all' ? undefined : regionFilter,
      });
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      toast.error('Failed to load programs');
    }
  };

  // Apply filters when they change
  useEffect(() => {
    if (data) {
      fetchPrograms();
    }
  }, [typeFilter, regionFilter]);

  const programs = data?.programs || [];

  const filteredPrograms = programs.filter((program: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      program.name?.toLowerCase().includes(query) ||
      program.description?.toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 mt-32">
        {/* Header */}
        <div className="text-black">
          <h1 className="text-3xl text-black font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-black" />
            Program Intelligence Library
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover fellowships, scholarships, and accelerators aligned with
            your goals
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Program Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fellowship">Fellowship</SelectItem>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="accelerator">Accelerator</SelectItem>
                </SelectContent>
              </Select>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="Africa">Africa</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Americas">Americas</SelectItem>
                  <SelectItem value="Asia">Asia</SelectItem>
                  <SelectItem value="Global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Programs List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredPrograms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No programs found</p>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button onClick={fetchPrograms} variant="outline">
                Refresh Programs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPrograms.map((program: any, idx: number) => (
              <Card
                key={idx}
                className="hover:shadow-lg hover:shadow-primary/5 transition-all border-border/50 hover:border-primary/50"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <CardTitle className="text-xl">{program.name}</CardTitle>
                        <Badge variant="secondary">{program.type}</Badge>
                        {program.matchScore && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {program.matchScore}% Match
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{program.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {program.deadline && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Deadline:{' '}
                          {new Date(program.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {program.region && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{program.region}</span>
                      </div>
                    )}
                  </div>

                  {program.eligibility && program.eligibility.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        Eligibility Requirements:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {program.eligibility.map((req: string, i: number) => (
                          <Badge key={i} variant="outline">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {program.url && (
                      <Button variant="default" size="sm" asChild>
                        <a
                          href={program.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Official Website
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
