import { useQuery } from "@tanstack/react-query";
import { type Resource } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Resources() {
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/health-content"],
  });

  // Convert Set to Array to avoid iteration issues
  const categories = resources 
    ? Array.from(new Set(resources.map(r => r.category)))
    : [];

  return (
    <div className="py-12 container px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Mental Health Resources</h1>
          <p className="text-lg text-muted-foreground">
            Access our library of mental health resources, guides, and educational materials.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-32" />
              </Card>
            ))}
          </div>
        ) : (
          <Tabs defaultValue={categories[0]}>
            <TabsList className="w-full justify-start mb-6 flex-wrap">
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map(category => (
              <TabsContent key={category} value={category}>
                <div className="grid gap-4">
                  {resources
                    ?.filter(r => r.category === category)
                    .map(resource => (
                      <Card key={resource.id}>
                        <CardHeader>
                          <CardTitle>{resource.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">
                            {resource.summary}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {resource.tags?.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}