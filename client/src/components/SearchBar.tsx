import React from "react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClearSearch: () => void;
  onGoBack: () => void;
  onOpenWishlist: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onClearSearch,
  onGoBack,
  onOpenWishlist
}) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white border-b">
      <button onClick={onGoBack} className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="relative flex-1">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            className="bg-transparent border-0 outline-none flex-1 ml-2 text-gray-800 h-8 text-sm" 
            placeholder="Game Boy, Nintendo, Mario..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {searchQuery && (
            <button 
              onClick={onClearSearch} 
              className="ml-1 h-6 w-6 flex items-center justify-center flex-shrink-0 text-gray-500"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <button onClick={onOpenWishlist} className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
