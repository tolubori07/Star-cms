import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <div className="flex items-center w-full space-x-4 animate-pulse">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 sm:w-[250px] w-[100px]" />
        <Skeleton className="h-4 sm:w-[200px] w-[100px]" />
      </div>
    </div>
  );
};

export default loading;
