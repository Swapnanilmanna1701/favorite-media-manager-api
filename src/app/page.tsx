"use client";

import { ApiTester } from "@/components/api-tester";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Film } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Film className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Movie & TV Show API
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              RESTful backend service to manage your favorite movies and TV shows
            </p>
          </div>

          {/* API Documentation */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                <CardTitle>API Documentation</CardTitle>
              </div>
              <CardDescription>
                Available endpoints for managing entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <Badge className="mt-0.5">GET</Badge>
                    <div className="flex-1">
                      <code className="text-sm font-mono">/api/entries</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        List all entries with pagination and search. Params: page, limit, search
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <Badge variant="secondary" className="mt-0.5">POST</Badge>
                    <div className="flex-1">
                      <code className="text-sm font-mono">/api/entries</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Create a new entry. Required: title, type, director, budget, location, duration, year
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <Badge variant="outline" className="mt-0.5">GET</Badge>
                    <div className="flex-1">
                      <code className="text-sm font-mono">/api/entries/:id</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Get a single entry by ID
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <Badge variant="default" className="mt-0.5 bg-orange-500">PUT</Badge>
                    <div className="flex-1">
                      <code className="text-sm font-mono">/api/entries/:id</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Update an existing entry. All fields are optional (partial update)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <Badge variant="destructive" className="mt-0.5">DELETE</Badge>
                    <div className="flex-1">
                      <code className="text-sm font-mono">/api/entries/:id</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Delete an entry by ID
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Database: Turso (SQLite) • ORM: Drizzle • Validation: Zod
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive API Tester */}
          <ApiTester />

          {/* Tech Stack Info */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-semibold mb-1">Framework</div>
                  <div className="text-muted-foreground">Next.js 15</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Database</div>
                  <div className="text-muted-foreground">Turso (SQLite)</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">ORM</div>
                  <div className="text-muted-foreground">Drizzle</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Validation</div>
                  <div className="text-muted-foreground">Zod</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}