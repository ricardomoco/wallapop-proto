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

    // Set initial header opacity to 0 (transparent)
    setHeaderOpacity(0);
    
    // Initial call to set correct opacity based on current scroll position
    handleScroll();
    
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
      {/* Absolute positioned header to overlay image */}
      <div 
        ref={headerRef} 
        className="fixed top-0 left-0 right-0 z-10" 
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
          <div className="aspect-square flex items-center justify-center pt-16">
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
        
        {/* Seller Information */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <img 
                  src={sellerData.avatar} 
                  alt={sellerData.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{sellerData.name}</h3>
                <div className="flex items-center text-sm">
                  <div className="flex items-center text-yellow-500 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600">{sellerData.ratingCount} ratings</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleChat}
              className="flex items-center justify-center space-x-1 px-3 py-2 font-medium text-emerald-600"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>Chat</span>
            </button>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <span>Seller since 2022</span>
            <span className="mx-2">·</span>
            <span>{sellerData.salesCount} sales</span>
          </div>
        </div>
        
        {/* Product Description */}
        <div className="px-4 py-3 border-b">
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {product.description}
            
            This authentic Nintendo Game Boy Color has been fully tested and is in great working condition! Every button and feature has been checked.
            
            • Excellent battery life
            • Clean and disinfected
            • Original hardware, no modifications
            • Comes with protective case
          </p>
        </div>
        
        {/* Sustainability Row */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-start">
            <div className="bg-emerald-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-emerald-600">Making a positive impact</h3>
              <p className="text-sm text-gray-600 mt-1">
                By buying this pre-owned item, you're extending its life and reducing waste. Second-hand shopping can help reduce CO2 emissions by up to 82%.
              </p>
            </div>
          </div>
        </div>
        
        {/* Delivery Information */}
        <div className="px-4 py-3 border-b">
          <h3 className="font-medium mb-2">Delivery options</h3>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <Truck className="h-5 w-5 mr-3 text-purple-600" />
              <div>
                <p className="font-medium">Shipping</p>
                <p className="text-sm text-gray-600">Estimated delivery: 3-5 business days</p>
              </div>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="font-medium">Meet up</p>
                <p className="text-sm text-gray-600">Barcelona, Spain</p>
              </div>
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