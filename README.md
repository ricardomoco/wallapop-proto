
# Wallapop Buyer Evaluation Enhancements Prototype

🚀 Enhancing buyer decision-making with real-time demand signals

## Overview

This prototype introduces two key features designed to improve buyer confidence and accelerate decision-making on Wallapop:

1️⃣ **Favorite Count Visibility** → Shows how many users have favorited an item, providing social proof.

2️⃣ **Real-Time Popularity Indicator** → Displays a "⚡ Popular Item" tag when an item is being viewed by multiple users, creating urgency.

These features aim to increase buyer conversion rates by reducing hesitation and improving demand transparency.

## Project Structure

```
├── client/                      # Frontend application
│   ├── src/                     # Source files
│   │   ├── components/          # UI components
│   │   │   ├── ProductCard.tsx  # Product card with favorite count
│   │   │   ├── ProductGrid.tsx  # Grid for displaying products
│   │   │   └── ui/              # UI component library
│   │   ├── hooks/               # Custom hooks
│   │   ├── lib/                 # Utility functions
│   │   ├── pages/               # Application pages
│   │   │   ├── Home.tsx         # Home page with product listings
│   │   │   └── ProductDetail.tsx # Product detail with popularity indicator
│   │   └── index.css            # Global styles
│   └── index.html               # HTML entry point
├── server/                      # Backend server
│   ├── index.ts                 # Server entry point
│   ├── routes.ts                # API routes
│   └── storage.ts               # Data storage and mock database
├── shared/                      # Shared between frontend and backend
│   └── schema.ts                # Data schemas and types
└── public/                      # Static assets
```

## Installation & Setup

### Prerequisites
- Node.js 20+
- npm or yarn

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/yourusername/wallapop-buyer-enhancements.git
cd wallapop-buyer-enhancements
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser to view the application
```
http://localhost:5000
```

## Features & Implementation

### 1️⃣ Favorite Count Visibility

- **UI component** updates the favorite count dynamically.
- Data fetched from mock API simulating backend interactions.
- **Implementation:**
  - Each product card displays the number of favorites
  - Users can add/remove items from favorites
  - Count updates in real-time to show social proof
  - Example: "❤️ 43 people have favorited this item"

```typescript
// Example from ProductCard.tsx
<button
  onClick={handleToggleFavorite}
  disabled={isPending}
  className={`flex items-center gap-1.5 px-2 py-1 rounded-full shadow-sm border transition-colors ${
    isFavorite 
      ? 'bg-red-50 border-red-100' 
      : 'bg-white border-gray-200'
  }`}
>
  {isFavorite ? (
    <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )}
  <span className={`text-xs font-medium ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}>
    {likesCount}
  </span>
</button>
```

### 2️⃣ Real-Time Popularity Indicator

- Displays a "⚡ Popular Item" tag when multiple users are viewing the item.
- Creates urgency by indicating high demand.
- **Implementation:**
  - Prominent callout in the product details page
  - Highlighted with visual elements for attention
  - Simulates real-time activity with mock data

```typescript
// Example from ProductDetail.tsx
{/* Popular Item Callout */}
<div className="px-5 py-5 border-b bg-white">
  <div className="flex items-center p-4 bg-gray-100 rounded-lg">
    <div className="bg-amber-500 text-white p-1.5 rounded-full mr-3 flex items-center justify-center">
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    </div>
    <div>
      <p className="font-medium text-gray-900">Popular Item</p>
      <p className="text-sm text-gray-500">
        4 people are looking at this item right now
      </p>
    </div>
  </div>
</div>
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Get all products |
| `/api/products/:id` | GET | Get product by ID |
| `/api/favorites` | POST | Add product to favorites |
| `/api/favorites` | DELETE | Remove product from favorites |

## Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS, React Query
- **Backend**: Node.js, Express
- **State Management**: React Query, useState
- **UI Components**: Custom UI library with Tailwind

## License

MIT
