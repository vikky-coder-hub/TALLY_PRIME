import React, { useState } from 'react';
import { FileText, Download, Upload, ArrowLeft } from 'lucide-react'; //Calendar, Search, Filter,
import { useNavigate } from 'react-router-dom';

interface QuarterlyReturn {
  id: string;
  quarter: string;
  year: string;
  status: 'draft' | 'filed' | 'revised';
  filingDate?: string;
  acknowledgmentNo?: string;
  totalDeductees: number;
  totalTDS: number;
  dueDate: string;
}

const Form27Q: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'returns' | 'generate' | 'upload'>('returns');
  const [selectedQuarter, setSelectedQuarter] = useState('Q4');
  const [selectedYear, setSelectedYear] = useState('2023-24');
  const [filterYear, setFilterYear] = useState('2023-24');
  const [uploadQuarter, setUploadQuarter] = useState('Q4');
  const [uploadYear, setUploadYear] = useState('2023-24');

  // Handler functions
  const handleGenerateReturn = () => {
    if (!selectedQuarter || !selectedYear) {
      alert('Please select both quarter and financial year');
      return;
    }
    console.log('Generating return for:', { quarter: selectedQuarter, year: selectedYear });
    // Add generation logic here
  };

  const handlePreviewReturn = () => {
    if (!selectedQuarter || !selectedYear) {
      alert('Please select both quarter and financial year');
      return;
    }
    console.log('Previewing return for:', { quarter: selectedQuarter, year: selectedYear });
    // Add preview logic here
  };

  const handleUploadReturn = () => {
    if (!uploadQuarter || !uploadYear) {
      alert('Please select both quarter and financial year');
      return;
    }
    console.log('Uploading return for:', { quarter: uploadQuarter, year: uploadYear });
    // Add upload logic here
  };

  const handleExportReturns = () => {
    console.log('Exporting returns for year:', filterYear);
    // Add export logic here
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }
      
      const allowedTypes = ['text/plain', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only .txt and .pdf files are allowed');
        return;
      }
      
      console.log('Selected file:', file.name);
      // Add file upload logic here
    }
  };

  const handleViewReturn = (returnId: string) => {
    console.log('Viewing return:', returnId);
    // Add view logic here
  };

  const handleDownloadReturn = (returnId: string) => {
    console.log('Downloading return:', returnId);
    // Add download logic here
  };

  const handleEditReturn = (returnId: string) => {
    console.log('Editing return:', returnId);
    // Add edit logic here
  };

  const quarterlyReturns: QuarterlyReturn[] = [
    {
      id: '1',
      quarter: 'Q4',
      year: '2023-24',
      status: 'filed',
      filingDate: '2024-01-15',
      acknowledgmentNo: 'ACK123456789',
      totalDeductees: 25,
      totalTDS: 850000,
      dueDate: '2024-01-31'
    },
    {
      id: '2',
      quarter: 'Q3',
      year: '2023-24',
      status: 'filed',
      filingDate: '2023-10-30',
      acknowledgmentNo: 'ACK987654321',
      totalDeductees: 22,
      totalTDS: 780000,
      dueDate: '2023-10-31'
    },
    {
      id: '3',
      quarter: 'Q2',
      year: '2023-24',
      status: 'revised',
      filingDate: '2023-07-28',
      acknowledgmentNo: 'ACK456789123',
      totalDeductees: 20,
      totalTDS: 720000,
      dueDate: '2023-07-31'
    },
    {
      id: '4',
      quarter: 'Q1',
      year: '2024-25',
      status: 'draft',
      totalDeductees: 0,
      totalTDS: 0,
      dueDate: '2024-07-31'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filed':
        return 'bg-green-100 text-green-800';
      case 'revised':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen pt-[56px] px-4">
      <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-4">
            <button
                title='Back to Reports'
                type='button'
                  onClick={() => navigate('/app/tds')}
                  className="mr-4 p-2 rounded-full hover:bg-gray-200"
                >
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold">Form 27Q</h1>
            </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Form 27Q - TDS Quarterly Return (TCS)</h1>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'returns', label: 'Filed Returns' },
                { id: 'generate', label: 'Generate Return' },
                { id: 'upload', label: 'Upload Return' }              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as 'returns' | 'generate' | 'upload')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Filed Returns Tab */}
          {activeTab === 'returns' && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Form 27Q Overview</h3>
                <p className="text-sm text-purple-700">
                  Quarterly TCS (Tax Collected at Source) return for collection of tax under sections 206C, 206CA, 206CB, 206CC, 206CD, 206CE, 206CF, 206CG, 206CH, 206CI, 206CJ.
                </p>
              </div>              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-4">
                  <div>
                    <label htmlFor="filterYear" className="sr-only">Filter by Financial Year</label>
                    <select
                      id="filterYear"
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="2023-24">FY 2023-24</option>
                      <option value="2022-23">FY 2022-23</option>
                      <option value="2021-22">FY 2021-22</option>
                    </select>
                  </div>
                  <button 
                    type="button"
                    onClick={handleExportReturns}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-700">4</div>
                  <div className="text-sm text-purple-600">Total Returns</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">2</div>
                  <div className="text-sm text-green-600">Filed</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-700">1</div>
                  <div className="text-sm text-yellow-600">Revised</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-700">1</div>
                  <div className="text-sm text-gray-600">Draft</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Quarter</th>
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Year</th>
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Status</th>
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Collectees</th>
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Total TCS</th>
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Due Date</th>
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quarterlyReturns.map((return_) => (
                      <tr key={return_.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 border-b">
                          <span className="font-medium text-gray-900">{return_.quarter}</span>
                        </td>
                        <td className="p-4 border-b">
                          <span className="text-gray-700">{return_.year}</span>
                        </td>
                        <td className="p-4 border-b">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(return_.status)}`}>
                            {return_.status}
                          </span>
                        </td>
                        <td className="p-4 border-b">
                          <span className="text-gray-700">{return_.totalDeductees}</span>
                        </td>
                        <td className="p-4 border-b">
                          <span className="font-medium text-gray-900">₹{return_.totalTDS.toLocaleString()}</span>
                        </td>
                        <td className="p-4 border-b">
                          <span className="text-gray-700">{return_.dueDate}</span>
                        </td>                        <td className="p-4 border-b">
                          <div className="flex gap-2">
                            <button 
                              type="button"
                              onClick={() => handleViewReturn(return_.id)}
                              className="text-purple-600 hover:text-purple-800 text-sm"
                            >
                              View
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDownloadReturn(return_.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Download
                            </button>
                            {return_.status === 'draft' && (
                              <button 
                                type="button"
                                onClick={() => handleEditReturn(return_.id)}
                                className="text-orange-600 hover:text-orange-800 text-sm"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Generate Return Tab */}
          {activeTab === 'generate' && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Generate Form 27Q</h3>
                <p className="text-sm text-purple-700">
                  Generate quarterly TCS return for tax collected at source on sale of goods, services, and other transactions.
                </p>
              </div>              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="financialYear" className="block text-sm font-medium text-gray-700 mb-2">
                    Financial Year *
                  </label>
                  <select
                    id="financialYear"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="2023-24">2023-24</option>
                    <option value="2022-23">2022-23</option>
                    <option value="2021-22">2021-22</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="quarter" className="block text-sm font-medium text-gray-700 mb-2">
                    Quarter *
                  </label>
                  <select
                    id="quarter"
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Q1">Q1 (Apr-Jun)</option>
                    <option value="Q2">Q2 (Jul-Sep)</option>
                    <option value="Q3">Q3 (Oct-Dec)</option>
                    <option value="Q4">Q4 (Jan-Mar)</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Return Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Total Collectees</div>
                    <div className="text-xl font-bold text-gray-900">25</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total TCS Collected</div>
                    <div className="text-xl font-bold text-gray-900">₹8,50,000</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total TCS Deposited</div>
                    <div className="text-xl font-bold text-gray-900">₹8,50,000</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Transactions</div>
                    <div className="text-xl font-bold text-gray-900">125</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Section-wise Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-blue-600">Section 206C(1) (Sale of Goods)</div>
                    <div className="text-lg font-bold text-blue-900">₹5,50,000</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-600">Section 206C(1H) (E-commerce)</div>
                    <div className="text-lg font-bold text-blue-900">₹2,00,000</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-600">Section 206CC (Cash Receipt)</div>
                    <div className="text-lg font-bold text-blue-900">₹1,00,000</div>
                  </div>
                </div>
              </div>              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={handleGenerateReturn}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Generate Return
                </button>
                <button 
                  type="button"
                  onClick={handlePreviewReturn}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Preview
                </button>
              </div>
            </div>
          )}

          {/* Upload Return Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Upload Filed Return</h3>
                <p className="text-sm text-yellow-700">
                  Upload the acknowledgment file received after filing Form 27Q with the Income Tax Department.
                </p>
              </div>              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Acknowledgment File
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Supports .txt, .pdf files up to 5MB
                </p>
                <div className="relative">
                  <input
                    type="file"
                    id="fileUpload"
                    accept=".txt,.pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <label
                    htmlFor="fileUpload"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              </div>              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="uploadQuarter" className="block text-sm font-medium text-gray-700 mb-2">
                    Quarter
                  </label>
                  <select
                    id="uploadQuarter"
                    value={uploadQuarter}
                    onChange={(e) => setUploadQuarter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Q1">Q1 (Apr-Jun)</option>
                    <option value="Q2">Q2 (Jul-Sep)</option>
                    <option value="Q3">Q3 (Oct-Dec)</option>
                    <option value="Q4">Q4 (Jan-Mar)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="uploadYear" className="block text-sm font-medium text-gray-700 mb-2">
                    Financial Year
                  </label>
                  <select
                    id="uploadYear"
                    value={uploadYear}
                    onChange={(e) => setUploadYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="2023-24">2023-24</option>
                    <option value="2022-23">2022-23</option>
                    <option value="2021-22">2021-22</option>
                  </select>
                </div>
              </div>              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={handleUploadReturn}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Upload Return
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form27Q;