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
    <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b">
      <div className="flex-1 flex justify-center">
        <button 
          onClick={onOpenFilterDrawer} 
          className="flex items-center justify-center gap-1.5 text-sm text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
          {activeFilters > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-medium text-white bg-orange-500 rounded-full">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      <div className="h-6 border-l border-gray-300"></div>

      <div className="flex-1 flex justify-center">
        <button 
          onClick={onOpenSortOptions} 
          className="flex items-center justify-center gap-1.5 text-sm text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          {sortOption}
        </button>
      </div>
    </div>
  );
};

export default FilterSortBar;
