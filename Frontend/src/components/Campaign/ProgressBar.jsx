import React from "react";

const ProgressBar = ({ raised, goal }) => {
  const percentage = Math.min((raised / goal) * 100, 100);

  return (
    <div className="w-full bg-gray-200 h-3 rounded-full mt-3">
      <div
        className="h-3 bg-green-500 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;