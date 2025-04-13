import { useQuery, useMutation } from "@tanstack/react-query";
import { type HealthContent, insertHealthContentSchema } from "@shared/schema";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function ContentManager() {
  const { toast } = useToast();
  const [selectedContent, setSelectedContent] = useState<HealthContent | null>(null);
  const [user, setUser] = useState<{ username: string } | null | undefined>(undefined);
  const [_, navigate] = useLocation();

  // Load user
  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    } else {
      setUser(null);
    }
  }, []);

  // Redirect if not admin
  useEffect(() => {
    if (user !== undefined && (!user || user.username !== "admin")) {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  // Fetch content regardless of user role
  const { data: content, isLoading } = useQuery<HealthContent[]>({
    queryKey: ["/api/health-content"],
  });

  // Setup form
  const form = useForm({
    resolver: zodResolver(insertHealthContentSchema),
    defaultValues: {
      title: "",
      content: "",
      summary: "",
      category: "",
      author: "",
      status: "draft",
      tags: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: HealthContent) => {
      return apiRequest("POST", "/api/health-content", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-content"] });
      toast({
        title: "Content created",
        description: "Your content has been saved successfully.",
      });
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<HealthContent> }) => {
      return apiRequest("PATCH", `/api/health-content/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-content"] });
      toast({
        title: "Content updated",
        description: "Your changes have been saved successfully.",
      });
    },
  });

  const onSubmit = async (data: HealthContent) => {
    if (selectedContent) {
      await updateMutation.mutateAsync({ id: selectedContent.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  // Handle loading and unauthorized access cleanly
  if (user === undefined) return <p>Loading user...</p>;
  if (!user || user.username !== "admin") return null;
  return (
    <div className="py-12 container px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Content Management</h1>
          <p className="text-lg text-muted-foreground">
            Create and manage mental health awareness content
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Content List */}
          <Card>
            <CardHeader>
              <CardTitle>Published Content</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading content...</p>
              ) : (
                <div className="space-y-4">
                  {content?.map(item => (
                    <div
                      key={item.id}
                      className="p-4 border rounded hover:bg-muted cursor-pointer"
                      onClick={() => setSelectedContent(item)}
                    >
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.summary}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedContent ? "Edit Content" : "Create New Content"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[200px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="anxiety">Anxiety</SelectItem>
                            <SelectItem value="depression">Depression</SelectItem>
                            <SelectItem value="wellness">Wellness</SelectItem>
                            <SelectItem value="self-care">Self Care</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? "Saving..."
                        : selectedContent
                        ? "Update Content"
                        : "Create Content"}
                    </Button>
                    {selectedContent && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSelectedContent(null);
                          form.reset();
                        }}
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


