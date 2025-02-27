import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type ProductResponse } from "@shared/schema";
import StatusBar from "@/components/StatusBar";
import SearchBar from "@/components/SearchBar";
import FilterSortBar from "@/components/FilterSortBar";
import ProductGrid from "@/components/ProductGrid";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(1);
  const [sortOption, setSortOption] = useState("Relevance");
  
  // We're using a placeholder userId for demo purposes; in a real app, this would come from auth
  const userId = 1;
  
  // Fetch products with the current search query
  const { data: products, isLoading, error, refetch } = useQuery<ProductResponse[]>({
    queryKey: ['/api/products', searchQuery, userId],
    queryFn: () => fetch(`/api/products?q=${encodeURIComponent(searchQuery)}&userId=${userId}`).then(res => res.json()),
  });

  // Force a refetch when the component mounts
  useEffect(() => {
    refetch();
    console.log("Home component mounted, refetching products");
  }, [refetch]);
  
  useEffect(() => {
    if (error) {
      console.error("Error fetching products:", error);
    }
  }, [error]);
  
  const handleClearSearch = () => {
    setSearchQuery("");
  };
  
  const handleOpenFilterDrawer = () => {
    toast({
      title: "Filters",
      description: "Filter options would open here",
      duration: 2000,
    });
  };
  
  const handleOpenSortOptions = () => {
    toast({
      title: "Sort Options",
      description: "Sort options would open here",
      duration: 2000,
    });
  };
  
  const handleGoBack = () => {
    toast({
      title: "Navigation",
      description: "This would navigate back to previous page",
      duration: 2000,
    });
  };
  
  const handleOpenWishlist = () => {
    toast({
      title: "Wishlist",
      description: "This would open your wishlist/favorites",
      duration: 2000,
    });
  };
  
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white safe-area-top">
        <StatusBar />
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClearSearch={handleClearSearch}
          onGoBack={handleGoBack}
          onOpenWishlist={handleOpenWishlist}
        />
        <FilterSortBar 
          activeFilters={activeFilters}
          sortOption={sortOption}
          onOpenFilterDrawer={handleOpenFilterDrawer}
          onOpenSortOptions={handleOpenSortOptions}
        />
      </header>
      
      <main className="px-3 py-4 md:px-4 md:py-6 flex-grow">
        <div className="mb-4">
          <h1 className="text-xl font-semibold mb-1">Find what you want</h1>
          <div className="flex items-center text-sm text-gray-500">
            Search results
            <button className="ml-1 h-6 w-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <ProductGrid products={products || []} isLoading={isLoading} userId={userId} />
      </main>
      
      <div className="h-6 safe-area-bottom"></div>
    </div>
  );
}
