import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const CostCenterList: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Placeholder data - replace with actual cost center data from context
  const costCenters = [
    { id: '1', name: 'Production', category: 'Manufacturing' },
    { id: '2', name: 'Sales', category: 'Marketing' },
    { id: '3', name: 'Administration', category: 'General' }
  ];

  const filteredCostCenters = costCenters.filter(center =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cost Center List</h1>
        <button
        title='Create New Cost Center'
          onClick={() => navigate('/masters/cost-center/create')}
          className={`flex items-center px-4 py-2 rounded ${
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={18} className="mr-1" />
          Create Cost Center
        </button>
      </div>
      
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="flex items-center mb-4">
          <div className={`flex items-center w-full max-w-md px-3 py-2 rounded-md ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Search size={18} className="mr-2 opacity-70" />
            <input
              type="text"
              placeholder="Search cost centers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-transparent border-none outline-none ${
                theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'
              }`}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${
                theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
              }`}>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCostCenters.map((center) => (
                <tr 
                  key={center.id}
                  className={`${
                    theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
                  } hover:bg-opacity-10 hover:bg-blue-500`}
                >
                  <td className="px-4 py-3">{center.name}</td>
                  <td className="px-4 py-3">{center.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                        title="Edit Cost Center"
                        onClick={() => navigate(`/masters/cost-center/edit/${center.id}`)}
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        title="Delete Cost Center"
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCostCenters.length === 0 && (
          <div className="text-center py-8">
            <p className="opacity-70">No cost centers found matching your search.</p>
          </div>
        )}
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Keyboard Shortcuts:</span> Ctrl+C to create a new cost center, Ctrl+A to alter, Ctrl+D to delete.
        </p>
      </div>
    </div>
  );
};

export default CostCenterList;