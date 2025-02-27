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
        imageUrl: "https://i.ibb.co/v3XsXc3/pokemon-blue.jpg", 
        isReserved: false,
        shippingAvailable: true
      },
      {
        name: "Gameboy Color Transparent",
        price: 9000, // €90.00
        description: "Transparent Game Boy Color in excellent working condition",
        imageUrl: "https://i.ibb.co/T0XTb1K/gameboy-transparent.jpg",
        isReserved: false,
        shippingAvailable: true
      },
      {
        name: "Game Boy Color (Lime Green)",
        price: 7000, // €70.00
        description: "Lime Green Game Boy Color, minor scratches but works perfectly",
        imageUrl: "https://i.ibb.co/Xj9Fnxy/gameboy-green.jpg",
        isReserved: false,
        shippingAvailable: true
      },
      {
        name: "Game Boy Color Transparent Purple",
        price: 2500, // €25.00
        description: "Transparent Purple Game Boy Color with slight discoloration",
        imageUrl: "https://i.ibb.co/K7s6R3t/gameboy-purple.jpg",
        isReserved: true,
        shippingAvailable: true
      },
      {
        name: "Zelda Oracle of Ages - GBC",
        price: 4500, // €45.00
        description: "The Legend of Zelda: Oracle of Ages for Game Boy Color - EU version",
        imageUrl: "https://i.ibb.co/DG6VC1p/zelda-oracle.jpg",
        isReserved: false,
        shippingAvailable: true
      },
      {
        name: "Super Mario Land 2 - Game Boy",
        price: 3200, // €32.00
        description: "Super Mario Land 2: 6 Golden Coins for original Game Boy",
        imageUrl: "https://i.ibb.co/z4HwyHN/mario-land-2.jpg",
        isReserved: false,
        shippingAvailable: false
      },
      {
        name: "Game Boy Camera - Green",
        price: 6500, // €65.00
        description: "Original Nintendo Game Boy Camera in green color, fully functional",
        imageUrl: "https://i.ibb.co/CVyQZp6/gameboy-camera.jpg",
        isReserved: false,
        shippingAvailable: true
      },
      {
        name: "Wario Land 3 - Game Boy Color",
        price: 3800, // €38.00
        description: "Wario Land 3 for Game Boy Color - Japanese version but plays in any GBC",
        imageUrl: "https://i.ibb.co/5BQHwJw/wario-land.jpg",
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
    
    // Ensure all required fields have proper non-null values
    const product: Product = { 
      ...insertProduct, 
      id,
      description: insertProduct.description || null,
      isReserved: insertProduct.isReserved === undefined ? false : insertProduct.isReserved,
      shippingAvailable: insertProduct.shippingAvailable === undefined ? true : insertProduct.shippingAvailable
    };
    
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
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      description: product.description || undefined,
      // Convert nullable to non-nullable booleans 
      isReserved: Boolean(product.isReserved),
      shippingAvailable: Boolean(product.shippingAvailable),
      formattedPrice: `€${(product.price / 100).toFixed(0)}`,
      isFavorited: userId ? favoritedProductIds.has(product.id) : false
    }));
  }
}

export const storage = new MemStorage();
