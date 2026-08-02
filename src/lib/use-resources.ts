import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { Resource } from "@/data/catalog";
import { listResources } from "@/lib/resources.functions";

export function useResources() {
  const fetchResources = useServerFn(listResources);
  const query = useQuery({
    queryKey: ["resources"],
    queryFn: () => fetchResources(),
    staleTime: 30_000,
  });
  const resources: Resource[] = query.data ?? [];
  return { resources, isLoading: query.isLoading };
}
