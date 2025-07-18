import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, Printer, Download, Filter } from 'lucide-react';
import FilterPanel from '../reports/FilterPanel';
import ReportTable from './ReportTable';
import type { StockItem, StockGroup, VoucherEntry } from '../../types';

// Define types for summary data
interface ItemSummary {
  item: StockItem;
  inwardQty: number;
  outwardQty: number;
  closingQty: number;
  closingValue: number;
  profit: number;
}

interface GroupSummary {
  group: StockGroup;
  inwardQty: number;
  outwardQty: number;
  closingQty: number;
  closingValue: number;
  profit: number;
}

type SummaryData = ItemSummary | GroupSummary;

const StockSummary: React.FC = () => {
  const { theme, stockItems, stockGroups, companyInfo } = useAppContext();
  const navigate = useNavigate();
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [view, setView] = useState<'Item' | 'Group'>('Item');
  const [filters, setFilters] = useState({
    fromDate: companyInfo?.financialYear || '2025-04-01',
    toDate: new Date().toISOString().split('T')[0],
    stockGroupId: '',
    stockItemId: '',
    godownId: '',
    batchId: '',
    period: 'Monthly' as 'Daily' | 'Weekly' | 'Fortnightly' | 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly',
    basis: 'Quantity' as 'Quantity' | 'Value' | 'Cost',
    showProfit: false,
  });

  // Mock voucher entries
  const [voucherEntries] = useState<VoucherEntry[]>([
    {
      id: '1',
      date: '2025-06-01',
      type: 'purchase',
      number: 'PUR-001',
      entries: [
        { id: '1-1', itemId: '1', quantity: 100, rate: 50, amount: 5000, type: 'debit', godownId: '1' },
        { id: '1-2', ledgerId: 'L1', amount: 5000, type: 'credit' },
      ],
    },
    {
      id: '2',
      date: '2025-06-15',
      type: 'sales',
      number: 'SAL-001',
      entries: [
        { id: '2-1', itemId: '1', quantity: 20, rate: 70, amount: 1400, type: 'credit', godownId: '1' },
        { id: '2-2', ledgerId: 'L2', amount: 1400, type: 'debit' },
      ],
    },
    {
      id: '3',
      date: '2025-05-01',
      type: 'stock-journal',
      number: 'SJ-001',
      entries: [
        { id: '3-1', itemId: '1', quantity: 50, rate: 50, amount: 2500, type: 'source', godownId: '1' },
        { id: '3-2', itemId: '2', quantity: 25, rate: 150, amount: 3750, type: 'destination', godownId: '2' },
      ],
    },
  ]);

  const filteredItems = stockItems.filter(item => (
    (!filters.stockGroupId || item.stockGroupId === filters.stockGroupId) &&
    (!filters.stockItemId || item.id === filters.stockItemId) &&
    (!filters.godownId || item.godownAllocations?.some(alloc => alloc.godownId === filters.godownId)) &&
    (!filters.batchId || item.batchDetails?.some(batch => batch.id === filters.batchId))
  ));

  const groupedItems = stockGroups.map(group => ({
    group,
    items: filteredItems.filter(item => item.stockGroupId === group.id),
  })).filter(g => g.items.length > 0);

  const calculateSummary = (items: StockItem[]) => {
    return items.map(item => {
      const itemTxns = voucherEntries
        .flatMap(voucher => voucher.entries.filter(entry => 
          entry.itemId === item.id &&
          voucher.date >= filters.fromDate &&
          voucher.date <= filters.toDate &&
          (!filters.godownId || entry.godownId === filters.godownId) &&
          (!filters.batchId || entry.batchId === filters.batchId)
        ));
      const inwardQty = itemTxns
        .filter(entry => entry.type === 'debit' || entry.type === 'destination')
        .reduce((sum, entry) => sum + (entry.quantity || 0), 0);
      const outwardQty = itemTxns
        .filter(entry => entry.type === 'credit' || entry.type === 'source')
        .reduce((sum, entry) => sum + (entry.quantity || 0), 0);
      const outwardValue = itemTxns
        .filter(entry => entry.type === 'credit' || entry.type === 'source')
        .reduce((sum, entry) => sum + (entry.amount || 0), 0);
      const closingQty = item.openingBalance + inwardQty - outwardQty;
      const closingValue = filters.basis === 'Cost'
        ? closingQty * (item.standardPurchaseRate || 0)
        : closingQty * (item.standardSaleRate || 0);
      const profit = filters.showProfit
        ? (outwardValue - (outwardQty * (item.standardPurchaseRate || 0)))
        : 0;
      return { item, inwardQty, outwardQty, closingQty, closingValue, profit };
    });
  };

  const calculateGroupSummary = () => {
    return groupedItems.map(({ group, items }) => {
      const summary = calculateSummary(items);
      return {
        group,
        inwardQty: summary.reduce((sum, s) => sum + s.inwardQty, 0),
        outwardQty: summary.reduce((sum, s) => sum + s.outwardQty, 0),
        closingQty: summary.reduce((sum, s) => sum + s.closingQty, 0),
        closingValue: summary.reduce((sum, s) => sum + s.closingValue, 0),
        profit: summary.reduce((sum, s) => sum + s.profit, 0),
      };
    });
  };

  const columns = useMemo(() => [
    { header: view === 'Item' ? 'Stock Item' : 'Stock Group', accessor: 'name', align: 'left' as const, render: (row: SummaryData) => view === 'Item' ? (row as ItemSummary).item.name : (row as GroupSummary).group.name },
    { header: 'Unit', accessor: 'unit', align: 'left' as const, render: (row: SummaryData) => view === 'Item' ? (row as ItemSummary).item.unit : '' },
    { header: 'Opening Qty', accessor: 'openingBalance', align: 'right' as const, render: (row: SummaryData) => view === 'Item' ? (row as ItemSummary).item.openingBalance.toLocaleString() : '' },
    { header: 'Inward Qty', accessor: 'inwardQty', align: 'right' as const, render: (row: SummaryData) => row.inwardQty.toLocaleString() },
    { header: 'Outward Qty', accessor: 'outwardQty', align: 'right' as const, render: (row: SummaryData) => row.outwardQty.toLocaleString() },
    { header: 'Closing Qty', accessor: 'closingQty', align: 'right' as const, render: (row: SummaryData) => row.closingQty.toLocaleString() },
    { header: 'Closing Value', accessor: 'closingValue', align: 'right' as const, render: (row: SummaryData) => `₹${row.closingValue.toLocaleString()}` },
    ...(filters.showProfit ? [{ header: 'Profit', accessor: 'profit', align: 'right' as const, render: (row: SummaryData) => `₹${row.profit.toLocaleString()}` }] : []),
  ], [view, filters.showProfit]);

  const data = view === 'Item' ? calculateSummary(filteredItems) : calculateGroupSummary();
  
  const footer = useMemo(() => [
    { accessor: 'name', value: 'Total' },
    { accessor: 'inwardQty', value: data.reduce((sum, row) => sum + row.inwardQty, 0).toLocaleString() },
    { accessor: 'outwardQty', value: data.reduce((sum, row) => sum + row.outwardQty, 0).toLocaleString() },
    { accessor: 'closingQty', value: data.reduce((sum, row) => sum + row.closingQty, 0).toLocaleString() },
    { accessor: 'closingValue', value: `₹${data.reduce((sum, row) => sum + row.closingValue, 0).toLocaleString()}` },
    ...(filters.showProfit ? [{ accessor: 'profit', value: `₹${data.reduce((sum, row) => sum + row.profit, 0).toLocaleString()}` }] : []),
  ], [data, filters.showProfit]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Stock Summary</title><style>body{font-family:Arial,sans-serif;padding:20px}h1{font-size:24px}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #ddd}</style></head>
          <body>
            <h1>${companyInfo?.name || 'Hanuman Car Wash'} - Stock Summary</h1>
            <p>From ${filters.fromDate} to ${filters.toDate}</p>
            <table>
              <thead>
                <tr>${columns.map(col => `<th style="text-align:${col.align}">${col.header}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${data.map(row => `<tr>${
                  columns.map(col => `<td style="text-align:${col.align}">${col.render ? col.render(row) : (row as Record<string, unknown>)[col.accessor]}</td>`).join('')
                }</tr>`).join('')}
              </tbody>
              <tfoot>
                <tr>${footer.map(f => `<td style="text-align:${columns.find(c => c.accessor === f.accessor)?.align}">${f.value}</td>`).join('')}</tr>
              </tfoot>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, [companyInfo?.name, filters.fromDate, filters.toDate, columns, data, footer]);

  const handleExport = useCallback(() => {
    const csv = [
      columns.map(col => col.header).join(','),
      ...data.map(row => columns.map(col => col.render ? col.render(row) : (row as Record<string, unknown>)[col.accessor]).join(',')),
      footer.map(f => f.value).join(','),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock_summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [columns, data, footer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault();
        setFilters({ ...filters }); // Trigger re-render
      } else if (e.key === 'F12') {
        e.preventDefault();
        alert('Configuration options not implemented yet.');
      } else if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        handleExport();
      } else if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filters, handleExport, handlePrint]);

  return (
    <div className="pt-[56px] px-4">
      <div className="flex items-center mb-6">
        <button
          title="Back to Reports"
          onClick={() => navigate('/app/reports')}
          className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Stock Summary</h1>
        <div className="ml-auto flex space-x-2">
          <select
          title="View Type"
            value={view}
            onChange={(e) => setView(e.target.value as 'Item' | 'Group')}
            className={`p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="Item">Stock Item-wise</option>
            <option value="Group">Stock Group-wise</option>
          </select>
          <button
            title="Toggle Filters"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Filter size={18} />
          </button>
          <button
            title="Print Report"
            onClick={handlePrint}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Printer size={18} />
          </button>
          <button
            title="Download Report"
            onClick={handleExport}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      <FilterPanel
        theme={theme}
        show={showFilterPanel}
        onToggle={() => setShowFilterPanel(!showFilterPanel)}
        filters={filters}
        onFilterChange={setFilters}
        stockGroups={stockGroups}
        stockItems={stockItems}
        godowns={companyInfo?.godowns || []}
      />

      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold">Stock Summary Report</h2>
          <p className="text-sm opacity-75">From {filters.fromDate} to {filters.toDate}</p>
        </div>

        <ReportTable
          theme={theme}
          columns={columns}
          data={data}
          footer={footer}
          onRowClick={(row) => navigate(`/reports/movement-analysis?itemId=${view === 'Item' ? (row as ItemSummary).item.id : ''}&groupId=${view === 'Group' ? (row as GroupSummary).group.id : ''}`)}
        />
      </div>

      <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Keyboard Shortcuts:</span> F5 to refresh, F12 to configure, Ctrl+E to export, Ctrl+P to print.
        </p>
      </div>
    </div>
  );
};

export default StockSummary;