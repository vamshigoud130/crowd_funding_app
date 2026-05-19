import React from "react";

const TrustScore = ({ score }) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold">Trust Score</h3>
      <div className="w-full bg-gray-200 h-3 rounded-full mt-2">
        <div
          className="h-3 bg-blue-500 rounded-full"
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <p className="text-sm mt-1">{score}% Verified</p>
    </div>
  );
};

export default TrustScore;