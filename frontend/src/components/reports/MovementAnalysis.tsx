import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Filter } from 'lucide-react';

const MovementAnalysis: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex items-center mb-6">
        <button
            type="button"
            title="Back to Reports"
          onClick={() => navigate('/app/reports')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Movement Analysis</h1>
        <div className="ml-auto flex space-x-2">
          <button
            title="Toggle Filters"
            type='button'
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`p-2 rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <Filter size={18} />
          </button>
          <button
          title='Print Report'
          type='button'
            className={`p-2 rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <Printer size={18} />
          </button>
          <button
            title='Download Report'
            type='button'
            className={`p-2 rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <Download size={18} />
          </button>
        </div>
      </div>
      
      {showFilterPanel && (
        <div className={`p-4 mb-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <h3 className="font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Period
              </label>
              <select
              title='Select Period'
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="current-month">Current Month</option>
                <option value="current-quarter">Current Quarter</option>
                <option value="current-year">Current Financial Year</option>
                <option value="custom">Custom Period</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Stock Item
              </label>
              <select
                title='Select Stock Item'
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="">All Items</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold">Stock Movement Analysis</h2>
          <p className="text-sm opacity-75">Movement details for selected period</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${
                theme === 'dark' ? 'border-b border-gray-700' : 'border-b-2 border-gray-300'
              }`}>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Stock Item</th>
                <th className="px-4 py-3 text-left">Voucher Type</th>
                <th className="px-4 py-3 text-left">Voucher No.</th>
                <th className="px-4 py-3 text-right">Inward Qty</th>
                <th className="px-4 py-3 text-right">Outward Qty</th>
                <th className="px-4 py-3 text-right">Rate</th>
                <th className="px-4 py-3 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center opacity-70">
                  No stock movements found for selected period
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Pro Tip:</span> Press F5 to refresh, F12 to configure display options.
        </p>
      </div>
    </div>
  );
};

export default MovementAnalysis;