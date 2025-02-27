import React, { useState } from "react";
import { type ProductResponse } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: ProductResponse;
  userId: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, userId }) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(product.isFavorited);
  
  const addToFavoritesMutation = useMutation({
    mutationFn: () => 
      apiRequest("POST", "/api/favorites", { userId, productId: product.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites`,
        duration: 2000,
      });
    }
  });
  
  const removeFromFavoritesMutation = useMutation({
    mutationFn: () => 
      apiRequest("DELETE", "/api/favorites", { userId, productId: product.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Removed from favorites",
        description: `${product.name} has been removed from your favorites`,
        duration: 2000,
      });
    }
  });
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsFavorite(!isFavorite);
    
    if (!isFavorite) {
      addToFavoritesMutation.mutate();
    } else {
      removeFromFavoritesMutation.mutate();
    }
  };
  
  const isPending = addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending;
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md active:scale-[0.99]">
      <div className="relative">
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover absolute inset-0"
            loading="lazy"
          />
        </div>
        
        {product.isReserved && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded flex items-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Reserved
          </div>
        )}
        
        <button
          onClick={handleToggleFavorite}
          disabled={isPending}
          className="absolute right-2 bottom-2 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md transition-transform active:scale-90"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
      </div>
      <div className="p-3">
        <div className="text-lg font-bold mb-1">{product.formattedPrice}</div>
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        {product.shippingAvailable && (
          <div className="flex items-center text-xs text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 4H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="truncate">Shipping available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
