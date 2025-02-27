import React, { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type ProductResponse } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Heart, Share, Truck, MessageCircle, ChevronRight } from "lucide-react";

// Mock seller data
const sellerData = {
  name: "Moonlight S.",
  rating: 5,
  ratingCount: 4,
  salesCount: 5,
  avatar: "https://i.pravatar.cc/100?img=3"
};

export default function ProductDetail() {
  const { toast } = useToast();
  const [, params] = useRoute<{ id: string }>("/product/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  const [isFavorite, setIsFavorite] = useState(false);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerOpacity, setHeaderOpacity] = useState(0);
  
  // Control header transparency based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Calculate opacity based on scroll position (0 at top, 1 at image mid-point)
      const imageHeight = window.innerWidth; // assuming square aspect ratio
      const scrollThreshold = imageHeight / 2;
      const opacity = Math.min(1, window.scrollY / scrollThreshold);
      setHeaderOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fetch product detail
  const { data: product, isLoading } = useQuery<ProductResponse>({
    queryKey: ['/api/products', productId],
    queryFn: () => fetch(`/api/products/${productId}`).then(res => res.json()),
    enabled: !!productId,
  });

  // Update favorite state when product data loads
  useEffect(() => {
    if (product) {
      setIsFavorite(product.isFavorited);
    }
  }, [product]);

  const userId = 1; // For demo purposes, we're using a fixed user ID
  
  const addToFavoritesMutation = useMutation({
    mutationFn: () => 
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId })
      }).then(res => res.json()),
    onSuccess: () => {
      // Invalidate both the specific product and the products list to keep everything in sync
      queryClient.invalidateQueries({ queryKey: ['/api/products', productId] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Added to favorites",
        description: `${product?.name} has been added to your favorites`,
        duration: 2000,
      });
    }
  });
  
  const removeFromFavoritesMutation = useMutation({
    mutationFn: () => 
      fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId })
      }).then(res => res.json()),
    onSuccess: () => {
      // Invalidate both the specific product and the products list to keep everything in sync
      queryClient.invalidateQueries({ queryKey: ['/api/products', productId] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Removed from favorites",
        description: `${product?.name} has been removed from your favorites`,
        duration: 2000,
      });
    }
  });
  
  const handleToggleFavorite = () => {
    if (!isFavorite) {
      // Update the local state immediately for responsiveness
      setIsFavorite(true);
      addToFavoritesMutation.mutate();
    } else {
      // Update the local state immediately for responsiveness
      setIsFavorite(false);
      removeFromFavoritesMutation.mutate();
    }
  };

  const handleShare = () => {
    toast({
      title: "Share",
      description: "Sharing functionality would open here",
      duration: 2000,
    });
  };

  const handleBuy = () => {
    toast({
      title: "Purchase",
      description: `You are about to purchase ${product?.name}`,
      duration: 2000,
    });
  };

  const handleChat = () => {
    toast({
      title: "Chat",
      description: "Chat with seller functionality would open here",
      duration: 2000,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-2">Product not found</h2>
        <p className="text-gray-500 mb-4">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="text-primary font-medium hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with dynamic opacity */}
      <div 
        ref={headerRef} 
        className="sticky top-0 z-10" 
        style={{
          backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
          boxShadow: headerOpacity > 0 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <Link 
            href="/" 
            className="w-10 h-10 flex items-center justify-center rounded-full" 
            style={{
              backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
              boxShadow: `0 1px 3px rgba(0,0,0,${headerOpacity * 0.1})`,
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center rounded-full"
              style={{
                backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
                boxShadow: `0 1px 3px rgba(0,0,0,${headerOpacity * 0.1})`,
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
              }}
              aria-label="Share"
            >
              <Share className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Mobile Optimized */}
      <div className="flex-1 bg-white">
        {/* Product Image */}
        <div className="relative w-full bg-gradient-to-b from-gray-100 to-white">
          <div className="aspect-square flex items-center justify-center">
            <img 
              src={product.imageUrl || "https://via.placeholder.com/500x500?text=No+Image"} 
              alt={product.name} 
              className="h-full w-full object-contain"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/500x500?text=No+Image";
              }}
            />
          </div>
        </div>

        {/* Price and Title */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="wallapop-price text-3xl font-bold">{product.formattedPrice}</div>
            <div className="flex items-center">
              <button 
                onClick={handleToggleFavorite}
                className="flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-gray-100"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                <span className="text-sm text-gray-500">{product.likesCount || 0}</span>
              </button>
            </div>
          </div>
          <h1 className="text-xl mb-2">{product.name} – Tested & Working! 🎮</h1>
          <div className="flex flex-wrap gap-x-1 text-sm text-gray-600">
            <span>Good condition</span>
            <span>·</span>
            <span>Nintendo</span>
            <span>·</span>
            <span>Nintendo Game Boy Color</span>
            <span>·</span>
            <span>Green</span>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="px-4 py-3 border-b flex items-center product-shipping">
          <Truck className="h-5 w-5 mr-2" />
          <span className="font-medium">Shipping available</span>
        </div>

        {/* Payment Options */}
        <div className="px-4 py-3 border-b">
          <div className="bg-pink-50 px-3 py-2 rounded-md flex items-center mb-3">
            <div className="klarna-badge bg-white rounded px-1 py-0.5 text-xs font-bold mr-2">Klarna</div>
            <div className="flex-1">
              <div className="text-sm">Pay over 3 installments of 23,33 €.</div>
              <button className="text-sm text-emerald-600 font-medium" onClick={() => alert("Klarna payment information")}>Learn more</button>
            </div>
          </div>
        </div>

        {/* Bottom spacing to accommodate fixed CTA */}
        <div className="h-24 safe-area-bottom"></div>
      </div>

      {/* Fixed Buy Button (always visible) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t shadow-lg safe-area-bottom">
        <button 
          onClick={handleBuy}
          className="wallapop-btn wallapop-btn-teal w-full py-3 px-4 text-white font-medium rounded-full"
        >
          Buy
        </button>
      </div>
    </div>
  );
}