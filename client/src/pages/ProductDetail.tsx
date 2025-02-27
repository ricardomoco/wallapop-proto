import React, { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type ProductResponse } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Heart, Share, Truck } from "lucide-react";

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
  
  // Track scrolling to show/hide the fixed Buy button
  const [showBuyButton, setShowBuyButton] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Control buy button visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolling down, hide at the top
      setShowBuyButton(window.scrollY > 100);
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
      queryClient.invalidateQueries({ queryKey: ['/api/products', productId] });
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
      queryClient.invalidateQueries({ queryKey: ['/api/products', productId] });
      toast({
        title: "Removed from favorites",
        description: `${product?.name} has been removed from your favorites`,
        duration: 2000,
      });
    }
  });
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    if (!isFavorite) {
      addToFavoritesMutation.mutate();
    } else {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div ref={headerRef} className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleToggleFavorite}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button 
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow"
              aria-label="Share"
            >
              <Share className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Image */}
      <div className="bg-white">
        <div className="relative aspect-square">
          <img 
            src={product.imageUrl || "https://via.placeholder.com/500x500?text=No+Image"} 
            alt={product.name} 
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/500x500?text=No+Image";
            }}
          />
        </div>
      </div>

      {/* Price and Title */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="text-3xl font-bold mb-2">{product.formattedPrice}</div>
        <h1 className="text-xl font-semibold mb-2">{product.name}</h1>
        <div className="flex flex-wrap gap-2 text-sm text-gray-500">
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
      <div className="bg-white px-4 py-3 border-b flex items-center text-purple-600">
        <Truck className="h-5 w-5 mr-2" />
        <span className="font-medium">Shipping available</span>
      </div>

      {/* Payment Options */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="bg-pink-50 px-3 py-2 rounded-md flex items-center mb-3">
          <div className="bg-white rounded px-1 py-0.5 text-xs font-bold mr-2">Klarna</div>
          <div>
            <div className="text-sm">Pay over 3 installments of 23,33 €.</div>
            <button className="text-sm text-emerald-600 font-medium" onClick={() => alert("Klarna payment information")}>Learn more</button>
          </div>
        </div>
      </div>

      {/* Seller Information */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={sellerData.avatar || "https://via.placeholder.com/100x100?text=Seller"}
              alt={sellerData.name}
              className="h-12 w-12 rounded-full object-cover mr-3"
              onError={(e) => {
                // Fallback if seller avatar fails to load
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/100x100?text=Seller";
              }}
            />
            <div>
              <div className="font-medium">{sellerData.name}</div>
              <div className="flex items-center">
                <div className="flex text-yellow-400 mr-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < sellerData.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">{sellerData.rating} ({sellerData.ratingCount})</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center text-pink-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h6a1 1 0 100-2H3z" clipRule="evenodd" />
                  </svg>
                  <span>{sellerData.salesCount} Sales</span>
                </div>
                <button className="text-teal-600" onClick={() => alert("Seller reviews")}>4 reviews</button>
              </div>
            </div>
          </div>
          <button
            onClick={handleChat}
            className="px-4 py-2 border border-teal-500 text-teal-500 rounded-full font-medium"
          >
            Chat
          </button>
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-white px-4 py-3 border-b">
        <p className="text-gray-700 leading-relaxed">
          Get your hands on this classic Game Boy Color in a vibrant Lime Green edition! The console is in good working condition, perfect for retro gaming enthusiasts and collectors. The screen, buttons, and sound are fully functional.
        </p>
        
        <div className="mt-4">
          <h3 className="font-medium flex items-center text-red-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Important Notes:
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Game NOT included (shown for display purposes only).</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Back cover is missing (battery compartment visible).</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Some minor signs of use, but plays games perfectly!</span>
            </li>
          </ul>
        </div>

        <p className="mt-4 text-gray-700">
          Just insert your favorite game cartridge to relive the nostalgia of classic handheld gaming!
        </p>

        <div className="mt-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brown-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Fast shipping available! Don't miss out—grab this piece of gaming history today!</span>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="bg-lime-100 rounded-md p-4 flex">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm">Buying items like this one saves, on average, the use of <strong>605 liters of water</strong></p>
            <button className="text-sm text-teal-600 font-medium" onClick={() => alert("Sustainability information")}>Learn how</button>
          </div>
        </div>
      </div>

      {/* Delivery Options */}
      <div className="bg-white px-4 py-3 border-b">
        <h3 className="font-medium mb-3">Delivery in 3 - 7 days <button className="text-teal-600 text-sm float-right" onClick={() => alert("Delivery information")}>+ info</button></h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-red-600 text-white text-xs p-1 mr-3 flex-shrink-0">
                CTT
              </div>
              <div>At a pick up point <strong>from €3,39</strong></div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="border border-gray-300 p-1 mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>At my address <strong>from €4,29</strong></div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Fixed Buy Button (visible when scrolling) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t shadow-lg transform transition-transform duration-300 ${showBuyButton ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <button 
          onClick={handleBuy}
          className="w-full py-3 px-4 bg-teal-500 text-white font-medium rounded-full hover:bg-teal-600 transition-colors"
        >
          Buy
        </button>
      </div>
      
      {/* Empty space to prevent content from being hidden behind the fixed button */}
      <div className="h-24"></div>
    </div>
  );
}