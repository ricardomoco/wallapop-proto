import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  favorites, type Favorite, type InsertFavorite,
  type ProductResponse
} from "@shared/schema";

// Storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Favorite methods
  getFavoritesByUserId(userId: number): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, productId: number): Promise<boolean>;
  isFavorited(userId: number, productId: number): Promise<boolean>;
  
  // API Response formatting
  getProductsWithFavoriteStatus(userId: number | null, searchQuery?: string): Promise<ProductResponse[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private favorites: Map<number, Favorite>;
  private userIdCounter: number;
  private productIdCounter: number;
  private favoriteIdCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.favorites = new Map();
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.favoriteIdCounter = 1;
    
    // Initialize with sample products
    this.initSampleProducts();
  }
  
  private initSampleProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Pokémon Azul (Blue)",
        price: 2800, // €28.00
        description: "Original Pokémon Blue game cartridge in good condition",
        imageUrl: "https://assets.Nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_auto/c_scale,w_300/v1/Nintendo%20Switch/Posters/blue-poster", 
        isReserved: false,
        shippingAvailable: true
      },
      {
        name: "Gameboy Color Transparent",
        price: 9000, // €90.00
        description: "Transparent Game Boy Color in excellent working condition",
        imageUrl: "https://oyster.ignimgs.com/wordpress/stg.ign.com/2017/06/gameboy_color_transparent_purple.jpg",
        isReserved: false,
        shippingAvailable: true
      },
      {
        name: "Game Boy Color (Lime Green)",
        price: 7000, // €70.00
        description: "Lime Green Game Boy Color, minor scratches but works perfectly",
        imageUrl: "https://i.pcmag.com/imagery/articles/03WQ3PhwG4zvYPiWaBC1pw2-3.fit_lim.size_1200x630.v1569492161.jpg",
        isReserved: false,
        shippingAvailable: true
      },
      {
        name: "Game Boy Color Transparent Purple",
        price: 2500, // €25.00
        description: "Transparent Purple Game Boy Color with slight discoloration",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Nintendo_Game_Boy_Color_Purple.jpg/1200px-Nintendo_Game_Boy_Color_Purple.jpg",
        isReserved: true,
        shippingAvailable: true
      }
    ];
    
    sampleProducts.forEach(product => this.createProduct(product));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    if (!query) {
      return this.getAllProducts();
    }
    
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product => 
      product.name.toLowerCase().includes(lowerQuery) || 
      (product.description && product.description.toLowerCase().includes(lowerQuery))
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  // Favorite methods
  async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(
      favorite => favorite.userId === userId
    );
  }
  
  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    // Check if already favorited
    const existing = Array.from(this.favorites.values()).find(
      fav => fav.userId === insertFavorite.userId && fav.productId === insertFavorite.productId
    );
    
    if (existing) {
      return existing;
    }
    
    const id = this.favoriteIdCounter++;
    const favorite: Favorite = { ...insertFavorite, id };
    this.favorites.set(id, favorite);
    return favorite;
  }
  
  async removeFavorite(userId: number, productId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      fav => fav.userId === userId && fav.productId === productId
    );
    
    if (!favorite) {
      return false;
    }
    
    return this.favorites.delete(favorite.id);
  }
  
  async isFavorited(userId: number, productId: number): Promise<boolean> {
    return Array.from(this.favorites.values()).some(
      fav => fav.userId === userId && fav.productId === productId
    );
  }
  
  // API Response formatting
  async getProductsWithFavoriteStatus(userId: number | null, searchQuery?: string): Promise<ProductResponse[]> {
    let products = searchQuery 
      ? await this.searchProducts(searchQuery)
      : await this.getAllProducts();
    
    const userFavorites = userId 
      ? await this.getFavoritesByUserId(userId) 
      : [];
      
    const favoritedProductIds = new Set(userFavorites.map(fav => fav.productId));
    
    return products.map(product => ({
      ...product,
      formattedPrice: `€${(product.price / 100).toFixed(0)}`,
      isFavorited: userId ? favoritedProductIds.has(product.id) : false
    }));
  }
}

export const storage = new MemStorage();
