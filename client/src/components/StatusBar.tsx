import React from "react";

const StatusBar: React.FC = () => {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();
  
  return (
    <div className="flex justify-between items-center px-4 py-2 text-sm bg-white border-b">
      <div className="font-semibold">{time}</div>
      <div className="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 4H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <div className="w-6 h-3 bg-yellow-400 rounded-full flex items-center justify-end">
          <div className="w-2 h-2 bg-white rounded-full mr-0.5"></div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
