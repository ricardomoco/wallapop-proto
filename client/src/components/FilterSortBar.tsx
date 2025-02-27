import React from "react";

interface FilterSortBarProps {
  activeFilters: number;
  sortOption: string;
  onOpenFilterDrawer: () => void;
  onOpenSortOptions: () => void;
}

const FilterSortBar: React.FC<FilterSortBarProps> = ({
  activeFilters,
  sortOption,
  onOpenFilterDrawer,
  onOpenSortOptions
}) => {
  return (
    <div className="flex justify-between px-4 py-2 bg-white border-b">
      <button 
        onClick={onOpenFilterDrawer} 
        className="flex items-center gap-1 font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Filters
        {activeFilters > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-semibold text-white bg-gray-800 rounded-full">
            {activeFilters}
          </span>
        )}
      </button>

      <button 
        onClick={onOpenSortOptions} 
        className="flex items-center gap-1 font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
        </svg>
        {sortOption}
      </button>
    </div>
  );
};

export default FilterSortBar;
