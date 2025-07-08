import React from "react";

const Table = ({ columns, data, loading = false, emptyMessage = "No data available", className = "", responsive = true }) => {
  if (loading) {
    return (
      <div className="card-base bg-white rounded-xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 text-responsive-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card-base bg-white rounded-xl overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-gray-500 text-responsive-md">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card-base bg-white rounded-xl overflow-hidden ${className}`}>
      {/* Desktop Table */}
      <div className={`${responsive ? "hidden md:block" : ""} overflow-x-auto`}>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50 transition-colors duration-200">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-responsive-sm text-gray-900">
                    {column.render ? column.render(row, rowIndex) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      {responsive && (
        <div className="md:hidden divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <div key={rowIndex} className="p-4 space-y-3">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{column.header}</span>
                  <span className="text-responsive-sm text-gray-900 text-right max-w-[60%]">{column.render ? column.render(row, rowIndex) : row[column.key]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Table;
