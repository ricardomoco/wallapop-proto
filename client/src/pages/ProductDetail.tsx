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
      fetch(`/api/favorites?userId=${userId}&productId=${productId}`, {
        method: "DELETE",
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
    if (isFavorite) {
      // Update the local state immediately for responsiveness
      setIsFavorite(false);
      removeFromFavoritesMutation.mutate();
    } else {
      // Update the local state immediately for responsiveness
      setIsFavorite(true);
      addToFavoritesMutation.mutate();
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
      {/* Fixed white header */}
      <div 
        ref={headerRef} 
        className="fixed top-0 left-0 right-0 z-10 bg-white border-b"
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <Link 
            href="/" 
            className="w-10 h-10 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center">
            <button 
              onClick={handleShare}
              className="flex items-center"
              aria-label="Share"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.68439 9.45L15.316 5.632M15.316 18.368L8.68439 14.55M21 5C21 6.65685 19.6569 8 18 8C16.3431 8 15 6.65685 15 5C15 3.34315 16.3431 2 18 2C19.6569 2 21 3.34315 21 5ZM9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12ZM21 19C21 20.6569 19.6569 22 18 22C16.3431 22 15 20.6569 15 19C15 17.3431 16.3431 16 18 16C19.6569 16 21 17.3431 21 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Mobile Optimized */}
      <div className="flex-1 bg-white">
        {/* Product Image - Full width */}
        <div className="relative w-full">
          <div className="aspect-square pt-12">
            <img 
              src={product.imageUrl || "https://via.placeholder.com/500x500?text=No+Image"} 
              alt={product.name} 
              className="h-full w-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/500x500?text=No+Image";
              }}
            />
          </div>
        </div>

        {/* Price and Title with Shipping Info */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="wallapop-price text-3xl font-bold">{product.formattedPrice}</div>
            <div className="flex items-center">
              <button 
                onClick={handleToggleFavorite}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full shadow-md bg-white"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                <span className="text-sm text-gray-500">{product.likesCount || 0}</span>
              </button>
            </div>
          </div>
          <h1 className="text-xl mb-2">{product.name} – Tested & Working! 🎮</h1>
          <div className="flex flex-wrap gap-x-1 text-sm text-gray-600 mb-3">
            <span>Good condition</span>
            <span>·</span>
            <span>Nintendo</span>
            <span>·</span>
            <span>Nintendo Game Boy Color</span>
            <span>·</span>
            <span>Green</span>
          </div>
          
          {/* Shipping Info - Moved inside price container */}
          <div className="flex items-center product-shipping">
            <Truck className="h-5 w-5 mr-2" />
            <span className="font-medium">Shipping available</span>
          </div>
        </div>

        {/* Payment Options - Klarna (Exactly as in IMG_2014) */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center">
            <div className="klarna-badge bg-pink-100 rounded px-1.5 py-0.5 text-xs font-bold mr-2">Klarna</div>
            <span className="text-sm text-gray-800">Pay over 3 installments of 23,33 €.</span>
          </div>
          <button className="text-sm text-emerald-600 font-medium mt-1" onClick={() => alert("Klarna payment information")}>Learn more</button>
        </div>
        
        {/* Seller Information - Exactly as in IMG_2014 */}
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
                <h3 className="font-medium text-base">Moonlight S.</h3>
                <div className="flex items-center">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-gray-700 text-sm">5 (4)</span>
                  </div>
                </div>
                <div className="flex items-center mt-1">
                  <svg className="h-4 w-4 text-pink-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">5 Sales</span>
                </div>
                <a href="#" className="text-emerald-600 text-sm font-medium">4 reviews</a>
              </div>
            </div>
            <button 
              onClick={handleChat}
              className="border border-emerald-500 rounded-full px-5 py-2 font-medium text-emerald-600"
            >
              Chat
            </button>
          </div>
        </div>
        
        {/* Popular Item Callout */}
        <div className="px-4 py-3 border-b">
          <div className="bg-gray-100 rounded-md px-4 py-3 flex items-center">
            <span className="text-amber-500 mr-3">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </span>
            <p className="text-sm font-medium">
              <span className="font-bold">Popular item.</span> Item is being viewed by 8 people.
            </p>
          </div>
        </div>
        
        {/* Product Description - Styled as in IMG_2014 */}
        <div className="px-4 py-3 border-b">
          <p className="text-gray-800 leading-relaxed">
            Get your hands on this classic Game Boy Color in a vibrant Lime Green edition! The console is in good working condition, perfect for retro gaming enthusiasts and collectors. The screen, buttons, and sound are fully functional.
          </p>
          <p className="text-gray-800 mt-4 leading-relaxed">
            🚀 Important Notes:
          </p>
          <ul className="mt-2 space-y-2">
            <li className="flex items-start">
              <span className="inline-block bg-green-500 text-white rounded p-0.5 mr-2 mt-0.5">✓</span>
              <span>Game NOT included (shown for display purposes only).</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-green-500 text-white rounded p-0.5 mr-2 mt-0.5">✓</span>
              <span>Back cover is missing (battery compartment visible).</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-green-500 text-white rounded p-0.5 mr-2 mt-0.5">✓</span>
              <span>Some minor signs of use, but plays games perfectly!</span>
            </li>
          </ul>
        </div>
        
        {/* Extra Info - Shipping Callout - as in IMG_2015 */}
        <div className="px-4 py-3 border-b">
          <p className="text-gray-800 leading-relaxed flex items-center">
            <span className="text-amber-800 mr-2">📦</span>
            Fast shipping available! Don't miss out—grab this piece of gaming history today!
          </p>
        </div>
        
        {/* Sustainability Row - Exactly as in IMG_2015 */}
        <div className="px-4 py-3 border-b">
          <div className="bg-lime-100 px-4 py-3 rounded-md flex items-start">
            <div className="mr-3 text-emerald-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm">
                Buying items like this one saves, on average, the use of <span className="font-bold">605 liters of water</span>
              </p>
              <a href="#" className="text-sm text-emerald-600 font-medium">Learn how</a>
            </div>
          </div>
        </div>
        
        {/* Delivery Information - Exactly as in IMG_2015 */}
        <div className="px-4 py-3 border-b">
          <h3 className="font-medium mb-3">Delivery in 3 - 7 days <span className="text-emerald-600 float-right">+ info</span></h3>
          
          <div className="flex items-center justify-between mb-3 py-2 border-b">
            <div className="flex items-center">
              <div className="bg-red-600 text-white px-1.5 py-0.5 text-xs mr-3">ctt</div>
              <div>
                <p className="text-sm">At a pick up point <span className="font-medium">from €3,39</span></p>
              </div>
            </div>
            <div>
              <a href="#" className="text-emerald-600 text-sm">See nearby pick up points</a>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="border border-gray-300 rounded p-1 mr-3">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm">At my address <span className="font-medium">from €4,29</span></p>
              </div>
            </div>
            <div>
              <a href="#" className="text-emerald-600 text-sm">Send to 4450-349 MATOSINHOS</a>
            </div>
          </div>
        </div>

        {/* Bottom spacing to accommodate fixed CTA */}
        <div className="h-24 safe-area-bottom"></div>
      </div>

      {/* Fixed Buy Button (always visible) - Matching the images */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t shadow-lg safe-area-bottom">
        <button 
          onClick={handleBuy}
          className="w-full py-3 px-4 text-white font-medium rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors"
        >
          Buy
        </button>
      </div>
    </div>
  );
}