import { Container } from "@/shared/ui/Container";
import { Skeleton } from "@/shared/ui/Skeleton";

export default function CatalogLoading() {
  return (
    <Container className="py-10 md:py-16">
      <Skeleton className="h-10 w-64 mb-4" />
      <Skeleton className="h-5 w-40 mb-10" />
      <div className="flex gap-2 mb-10 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </Container>
  );
}
