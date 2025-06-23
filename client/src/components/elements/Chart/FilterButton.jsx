import React from "react";

const FilterButton = ({ totalFilter, title }) => {
  return (
    <div className="button-filter flex items-center gap-3">
      {Array.from({ totalFilter }).map((_, index) => (
        <div key={index}>
          <Button className="w-auto bg-blue-600 px-5 py-2 font-semibold text-white rounded-md">{title}</Button>
        </div>
      ))}
    </div>
  );
};

export default FilterButton;
