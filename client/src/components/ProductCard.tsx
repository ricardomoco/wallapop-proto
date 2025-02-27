import React, { useState } from "react";
import { useLocation } from "wouter";
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
  const [, setLocation] = useLocation();
  const [isFavorite, setIsFavorite] = useState(product.isFavorited);
  const [likesCount, setLikesCount] = useState(product.likesCount);
  
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
    
    // Update likes count when toggling favorite status
    if (!isFavorite) {
      setLikesCount(prevCount => prevCount + 1);
      addToFavoritesMutation.mutate();
    } else {
      setLikesCount(prevCount => Math.max(0, prevCount - 1)); // Ensure count doesn't go below 0
      removeFromFavoritesMutation.mutate();
    }
  };
  
  const isPending = addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending;
  
  const handleCardClick = () => {
    setLocation(`/product/${product.id}`);
  };
  
  return (
    <div 
      className="overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" 
      style={{ maxWidth: "100%" }} 
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="aspect-square relative overflow-hidden bg-gray-50">
          <img 
            src={product.imageUrl || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/300";
            }}
          />
        </div>
        
        {product.isReserved && (
          <div className="absolute top-2 left-2 bg-white text-purple-600 text-xs font-medium px-2 py-1 rounded-md flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Reserved
          </div>
        )}
      </div>
      
      <div className="pt-2 pb-1">
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold">{product.formattedPrice}</div>
          <button
            onClick={handleToggleFavorite}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full shadow-sm border transition-colors ${
              isFavorite 
                ? 'bg-red-50 border-red-100' 
                : 'bg-white border-gray-200'
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
            <span className={`text-xs font-medium ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}>
              {likesCount}
            </span>
          </button>
        </div>
        
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        
        {/* Shipping truck icon at the bottom */}
        <div className="flex items-center mt-1 text-xs text-purple-600 font-medium">
          {product.shippingAvailable ? (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <span className="truncate">Shipping available</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="truncate">No shipping</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;