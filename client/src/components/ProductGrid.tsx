import React from "react";
import { type ProductResponse } from "@shared/schema";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: ProductResponse[];
  isLoading: boolean;
  userId: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading, userId }) => {
  const renderSkeletons = () => {
    return Array(8).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
        <Skeleton className="w-full aspect-square bg-gray-100" />
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-24 mt-2" />
        </div>
      </div>
    ));
  };

  // If there are no products even after loading
  if (!isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-1">No products found</h3>
        <p className="text-gray-500 max-w-xs">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-3 gap-y-4 md:gap-4 pb-4 scroll-container">
      {isLoading ? (
        renderSkeletons()
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} userId={userId} />
        ))
      )}
    </div>
  );
};

export default ProductGrid;
