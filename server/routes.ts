import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Product } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints
  const api = "/api";
  
  // Get all products with optional search query
  app.get(`${api}/products`, async (req, res) => {
    try {
      const searchQuery = req.query.q as string | undefined;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
      
      const products = await storage.getProductsWithFavoriteStatus(userId, searchQuery);
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  // Get a specific product by ID
  app.get(`${api}/products/:id`, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
      
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const isFavorited = userId 
        ? await storage.isFavorited(userId, productId)
        : false;
      
      res.json({
        ...product,
        formattedPrice: `€${(product.price / 100).toFixed(0)}`,
        isFavorited
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  // Add a product to favorites
  app.post(`${api}/favorites`, async (req, res) => {
    try {
      const { userId, productId } = req.body;
      
      if (!userId || !productId) {
        return res.status(400).json({ message: "userId and productId are required" });
      }
      
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const favorite = await storage.addFavorite({ userId, productId });
      
      res.status(201).json({ 
        success: true, 
        message: "Product added to favorites",
        favorite
      });
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });
  
  // Remove a product from favorites
  app.delete(`${api}/favorites`, async (req, res) => {
    try {
      const { userId, productId } = req.body;
      
      if (!userId || !productId) {
        return res.status(400).json({ message: "userId and productId are required" });
      }
      
      const success = await storage.removeFavorite(userId, productId);
      
      if (!success) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      res.json({ 
        success: true, 
        message: "Product removed from favorites" 
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });
  
  // Get all favorites for a user
  app.get(`${api}/favorites`, async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      
      const favorites = await storage.getFavoritesByUserId(userId);
      const productIds = favorites.map(fav => fav.productId);
      
      const productPromises = productIds.map(id => storage.getProduct(id));
      const products = (await Promise.all(productPromises)).filter(Boolean) as Product[];
      
      const formattedProducts = products.map(product => ({
        ...product,
        formattedPrice: `€${(product.price / 100).toFixed(0)}`,
        isFavorited: true
      }));
      
      res.json(formattedProducts);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
