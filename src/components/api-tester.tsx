"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, Edit, Plus, Search } from "lucide-react";

interface Entry {
  id: number;
  title: string;
  type: string;
  director: string;
  budget: number;
  location: string;
  duration: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data?: Entry | Entry[];
  message?: string;
  error?: string;
  details?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function ApiTester() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    type: "Movie",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      type: "Movie",
      director: "",
      budget: "",
      location: "",
      duration: "",
      year: "",
    });
    setEditingId(null);
  };

  const fetchEntries = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (search) params.append("search", search);

      const res = await fetch(`/api/entries?${params}`);
      const data = await res.json();
      setResponse(data);
      if (data.data) {
        setEntries(data.data);
      }
    } catch (error) {
      setResponse({ error: "Failed to fetch entries" });
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget),
          year: parseInt(formData.year),
        }),
      });
      const data = await res.json();
      setResponse(data);
      if (res.ok) {
        resetForm();
        fetchEntries(currentPage, searchTerm);
      }
    } catch (error) {
      setResponse({ error: "Failed to create entry" });
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (id: number) => {
    setLoading(true);
    try {
      const updateData: Record<string, any> = {};
      if (formData.title) updateData.title = formData.title;
      if (formData.type) updateData.type = formData.type;
      if (formData.director) updateData.director = formData.director;
      if (formData.budget) updateData.budget = parseFloat(formData.budget);
      if (formData.location) updateData.location = formData.location;
      if (formData.duration) updateData.duration = formData.duration;
      if (formData.year) updateData.year = parseInt(formData.year);

      const res = await fetch(`/api/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      setResponse(data);
      if (res.ok) {
        resetForm();
        fetchEntries(currentPage, searchTerm);
      }
    } catch (error) {
      setResponse({ error: "Failed to update entry" });
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setResponse(data);
      if (res.ok) {
        fetchEntries(currentPage, searchTerm);
      }
    } catch (error) {
      setResponse({ error: "Failed to delete entry" });
    } finally {
      setLoading(false);
    }
  };

  const loadEntryForEdit = (entry: Entry) => {
    setFormData({
      title: entry.title,
      type: entry.type,
      director: entry.director,
      budget: entry.budget.toString(),
      location: entry.location,
      duration: entry.duration,
      year: entry.year.toString(),
    });
    setEditingId(entry.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="entries" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entries">Browse Entries</TabsTrigger>
          <TabsTrigger value="add">Add/Edit Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entries List</CardTitle>
              <CardDescription>Browse all movies and TV shows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search by title or director..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => {
                    setCurrentPage(1);
                    fetchEntries(1, searchTerm);
                  }}
                  disabled={loading}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                    fetchEntries(1, "");
                  }}
                  disabled={loading}
                >
                  Clear
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : entries.length > 0 ? (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <Card key={entry.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{entry.title}</CardTitle>
                            <CardDescription>
                              Directed by {entry.director} • {entry.year}
                            </CardDescription>
                          </div>
                          <Badge variant={entry.type === "Movie" ? "default" : "secondary"}>
                            {entry.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Budget:</span>{" "}
                            <span className="font-medium">${entry.budget.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>{" "}
                            <span className="font-medium">{entry.location}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>{" "}
                            <span className="font-medium">{entry.duration}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ID:</span>{" "}
                            <span className="font-medium">{entry.id}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadEntryForEdit(entry)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteEntry(entry.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {response?.pagination && (
                    <div className="flex justify-between items-center pt-4">
                      <div className="text-sm text-muted-foreground">
                        Page {response.pagination.page} of {response.pagination.totalPages} (
                        {response.pagination.total} total entries)
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          disabled={!response.pagination.hasPrevPage || loading}
                          onClick={() => {
                            const newPage = currentPage - 1;
                            setCurrentPage(newPage);
                            fetchEntries(newPage, searchTerm);
                          }}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          disabled={!response.pagination.hasNextPage || loading}
                          onClick={() => {
                            const newPage = currentPage + 1;
                            setCurrentPage(newPage);
                            fetchEntries(newPage, searchTerm);
                          }}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    No entries found. Click "Add/Edit Entry" to create your first entry.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Entry" : "Add New Entry"}</CardTitle>
              <CardDescription>
                {editingId ? `Editing entry #${editingId}` : "Create a new movie or TV show entry"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., The Shawshank Redemption"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Movie">Movie</SelectItem>
                      <SelectItem value="TV Show">TV Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="director">Director *</Label>
                  <Input
                    id="director"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    placeholder="e.g., Frank Darabont"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="budget">Budget ($) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g., 25000000"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Ohio, USA"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 142 min or 47 min per episode"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g., 1994"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => (editingId ? updateEntry(editingId) : createEntry())}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {editingId ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                      {editingId ? "Update Entry" : "Create Entry"}
                    </>
                  )}
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>

              {response && (
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <pre className="text-xs">{JSON.stringify(response, null, 2)}</pre>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
