import React from "react";

const StretchGoals = ({ goals }) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold">Stretch Goals</h3>
      <ul className="list-disc ml-5 text-gray-600">
        {goals?.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>
    </div>
  );
};


export default StretchGoals;