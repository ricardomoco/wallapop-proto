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
    return Array(4).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="bg-white rounded-lg overflow-hidden shadow mb-4">
        <Skeleton className="w-full aspect-square" />
        <div className="p-3">
          <Skeleton className="h-6 w-16 mb-1" />
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    ));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
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
