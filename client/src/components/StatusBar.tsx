import React from "react";

const StatusBar: React.FC = () => {
  // Use actual time from screenshot - 16:32
  const time = "16:32";
  
  return (
    <div className="flex justify-between items-center px-4 py-2 text-sm bg-white border-b">
      <div className="font-semibold text-black">{time}</div>
      <div className="flex items-center gap-1">
        {/* Signal bars */}
        <div className="relative w-4 h-4 flex items-end">
          <div className="absolute bottom-0 left-0 w-1 h-1 bg-black rounded-sm"></div>
          <div className="absolute bottom-0 left-1.5 w-1 h-2 bg-black rounded-sm"></div>
          <div className="absolute bottom-0 left-3 w-1 h-3 bg-black rounded-sm"></div>
        </div>
        
        {/* WiFi */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <path d="M12 4C14.9695 4 17.3977 4.99351 19.1982 6.56789C19.4211 6.77091 19.4196 7.1204 19.1982 7.33302C19.0871 7.43577 18.9428 7.5 18.7855 7.5C18.6306 7.5 18.4881 7.43713 18.3778 7.33663C16.8747 5.95851 14.5452 5 12 5C9.45481 5 7.12534 5.95851 5.62215 7.33663C5.5119 7.43713 5.36941 7.5 5.21447 7.5C5.05723 7.5 4.91285 7.43577 4.80179 7.33302C4.58038 7.1204 4.57893 6.77091 4.80179 6.56789C6.60229 4.99351 9.03054 4 12 4Z" fill="currentColor"/>
          <path d="M12 8C13.9598 8 15.6999 8.7542 16.9469 9.95987C17.1696 10.1745 17.1646 10.5392 16.9355 10.7618C16.8249 10.8699 16.6757 10.9333 16.5213 10.9333C16.3705 10.9333 16.2245 10.8722 16.115 10.769C15.0824 9.76555 13.6189 9.13333 12 9.13333C10.3811 9.13333 8.91758 9.76555 7.88496 10.769C7.77551 10.8722 7.62952 10.9333 7.47867 10.9333C7.32428 10.9333 7.17505 10.8699 7.06448 10.7618C6.83544 10.5392 6.83043 10.1745 7.05309 9.95987C8.30007 8.7542 10.0402 8 12 8Z" fill="currentColor"/>
          <path d="M12 12C13.0544 12 14.0282 12.3868 14.7855 13.1127C15.0129 13.3316 15.0115 13.7057 14.7822 13.9289C14.672 14.036 14.5239 14.0976 14.3707 14.0976C14.2214 14.0976 14.0761 14.0386 13.9672 13.9364C13.4426 13.4344 12.7536 13.1429 12 13.1429C11.2464 13.1429 10.5574 13.4344 10.0328 13.9364C9.92388 14.0386 9.77863 14.0976 9.62933 14.0976C9.47612 14.0976 9.32805 14.036 9.21776 13.9289C8.98846 13.7057 8.98705 13.3316 9.21446 13.1127C9.97183 12.3868 10.9456 12 12 12Z" fill="currentColor"/>
          <path d="M12 16C12.5523 16 13 16.4477 13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16Z" fill="currentColor"/>
        </svg>
        
        {/* Battery */}
        <div className="w-7 h-3.5 bg-transparent rounded-sm border border-black relative flex items-center">
          <div className="w-5 h-2.5 bg-yellow-400 ml-0.5 rounded-sm"></div>
          <div className="absolute -right-0.5 top-0.5 h-2 w-1 bg-black rounded-r-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
