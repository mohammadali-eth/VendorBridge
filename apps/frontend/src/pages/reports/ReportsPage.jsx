import React, { useEffect, useState } from 'react';
import reportsService from '../../services/reportsService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Loader2,
  Calendar,
  FileDown,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  ChevronUp,
} from 'lucide-react';

const COLORS = ['#714B67', '#8A6080', '#A37799', '#BC8EB3', '#D5A5CD'];

export default function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [trends, setTrends] = useState([]);
  const [poStats, setPoStats] = useState(null);
  const [invoiceStats, setInvoiceStats] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  // Filters / Inputs
  const [monthFilter, setMonthFilter] = useState('May 2026');
  const [dateRange, setDateRange] = useState('');
  const [trendView, setTrendView] = useState('Monthly'); // Monthly, Quarterly, Yearly

  // Report Generator Fields
  const [reportType, setReportType] = useState('Procurement Spend Report');
  const [exportFormat, setExportFormat] = useState('PDF');
  const [deptFilter, setDeptFilter] = useState('All');
  const [vendorFilter, setVendorFilter] = useState('All');
  const [poStatusFilter, setPoStatusFilter] = useState('All');

  // Search
  const [vendorSearch, setVendorSearch] = useState('');

  const loadData = async () => {
    try {
      const [sum, cats, vends, trnds, po, inv, hist] = await Promise.all([
        reportsService.getSummary(),
        reportsService.getSpendAnalysis(),
        reportsService.getVendorPerformance(),
        reportsService.getProcurementTrends(),
        reportsService.getPoAnalytics(),
        reportsService.getInvoiceAnalytics(),
        reportsService.getReports(),
      ]);

      setSummary(sum || {});
      setCategories(cats || []);
      setVendors(vends || []);
      setTrends(trnds || []);
      setPoStats(po || {});
      setInvoiceStats(inv || {});
      setHistory(hist || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await reportsService.generateReport({
        name: reportType,
        format: exportFormat,
        filters: { department: deptFilter, vendor: vendorFilter, status: poStatusFilter },
      });
      showToast(`${reportType} (${exportFormat}) compiled successfully!`);
      const updatedHistory = await reportsService.getReports();
      setHistory(updatedHistory);
    } catch (err) {
      console.error(err);
      showToast('Failed to generate report.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteReport = async (id) => {
    try {
      await reportsService.deleteReport(id);
      showToast('Report configuration deleted');
      const updatedHistory = await reportsService.getReports();
      setHistory(updatedHistory);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadReport = async (id) => {
    try {
      const data = await reportsService.downloadReport(id);
      showToast(`Downloading file...`);
      
      const link = document.createElement('a');
      link.href = data.url;
      link.setAttribute('download', data.url.split('/').pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      showToast('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
        <span className="text-xs font-semibold font-sans">Compiling Procurement Metrics...</span>
      </div>
    );
  }

  // Filter vendors based on search input
  const filteredVendors = (vendors || []).filter((v) =>
    v?.vendor?.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left pb-16 relative">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 py-3 px-5 rounded-2xl shadow-xl text-xs font-bold border border-emerald-500 bg-emerald-600 text-white transition-all">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-[#111827] tracking-tight">Reports & Analytics</h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Procurement insights, spending trends, and vendor performance dashboards.
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs">
            <Calendar size={14} className="text-slate-400" />
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="May 2026">May 2026</option>
              <option value="Apr 2026">April 2026</option>
              <option value="Mar 2026">March 2026</option>
            </select>
          </div>

          <input
            type="date"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#714B67] shadow-xs"
          />

          <button
            onClick={() => showToast('Compiling comprehensive report...')}
            className="py-1.5 px-4 bg-[#714B67] hover:bg-[#5E3E56] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <FileDown size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* 2. Procurement Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Spend */}
        <Card className="flex flex-col justify-between p-4 bg-[#1e141c] text-white">
          <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">
            Total Spend
          </span>
          <div className="mt-2.5">
            <span className="text-lg font-black tracking-tight">
              ₹{summary?.totalSpend?.toLocaleString('en-IN') || '0'}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold block mt-1">
              +8% this month
            </span>
          </div>
        </Card>

        {/* Active Vendors */}
        <Card className="flex flex-col justify-between p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Active Vendors
          </span>
          <div className="mt-2.5">
            <span className="text-lg font-black text-slate-800 tracking-tight">
              {summary?.activeVendors || '0'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Approved Suppliers
            </span>
          </div>
        </Card>

        {/* POs Count */}
        <Card className="flex flex-col justify-between p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Purchase Orders
          </span>
          <div className="mt-2.5">
            <span className="text-lg font-black text-slate-800 tracking-tight">
              {summary?.poCount || '0'} POs
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Orders Generated
            </span>
          </div>
        </Card>

        {/* Completion Rate */}
        <Card className="flex flex-col justify-between p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Completion Rate
          </span>
          <div className="mt-2.5">
            <span className="text-lg font-black text-slate-800 tracking-tight">
              {summary?.invoiceCompletionRate || '0'}%
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Invoices Paid
            </span>
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card className="flex flex-col justify-between p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Pending Approvals
          </span>
          <div className="mt-2.5">
            <span className="text-lg font-black text-slate-800 tracking-tight">
              {summary?.pendingApprovals || '0'}
            </span>
            <span className="text-[10px] text-rose-500 font-bold block mt-1">
              Action Required
            </span>
          </div>
        </Card>

        {/* Overdue Invoices */}
        <Card className="flex flex-col justify-between p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Overdue Invoices
          </span>
          <div className="mt-2.5">
            <span className="text-lg font-black text-slate-800 tracking-tight">
              {summary?.overdueInvoices || '0'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Awaiting Payment
            </span>
          </div>
        </Card>
      </div>

      {/* Split block: Category spend + Top vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Spend By Category */}
        <Card className="space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-2">
            Spend By Category
          </h3>
          <div className="space-y-4 pt-2">
            {(categories || []).map((cat, idx) => (
              <div key={idx} className="space-y-1 text-xs font-semibold">
                <div className="flex justify-between text-slate-700">
                  <span>{cat.name}</span>
                  <span className="font-bold">₹{cat.amount?.toLocaleString('en-IN')} ({cat.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.percentage}%` }}
                    className="bg-[#714B67] h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 4. Vendor Performance Analytics */}
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">
              Top Vendors by Spend
            </h3>
            <div className="relative text-slate-455 focus-within:text-[#714B67] shrink-0 w-48">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5">
                <Search size={12} />
              </span>
              <input
                type="search"
                placeholder="Search vendor..."
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 pl-7 pr-2 text-[11px] focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-150 uppercase tracking-wider text-[9px]">
                  <th className="py-2 px-3">Vendor</th>
                  <th className="py-2 px-3 text-right">Spend</th>
                  <th className="py-2 px-3 text-center">POs</th>
                  <th className="py-2 px-3 text-center">On-Time %</th>
                  <th className="py-2 px-3 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 text-slate-900 font-black">{v.vendor}</td>
                    <td className="py-2 px-3 text-right">₹{v.spend?.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-center">{v.pos}</td>
                    <td className="py-2 px-3 text-center text-emerald-600">{v.deliveryRate}%</td>
                    <td className="py-2 px-3 text-center">
                      <Badge variant="success">{v.rating}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* KPI Cards section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 p-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Award size={18} />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
              Best Performing
            </span>
            <span className="text-xs font-black text-slate-800 block mt-0.5">TechCore Ltd</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="p-3 bg-[#f5eff3] rounded-xl text-[#714B67]">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
              Fastest Delivery
            </span>
            <span className="text-xs font-black text-slate-800 block mt-0.5">Infra Supplies</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <TrendingUp size={18} />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
              Most Orders
            </span>
            <span className="text-xs font-black text-slate-800 block mt-0.5">FastLog India</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Clock size={18} />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
              Procurement Saving
            </span>
            <span className="text-xs font-black text-emerald-600 block mt-0.5">₹85,000 Saved</span>
          </div>
        </Card>
      </div>

      {/* 5. Monthly Procurement Trend Chart */}
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">
              Monthly Spend Trend
            </h3>
            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
              Average Monthly Spend: ₹10,81,666
            </span>
          </div>
          <div className="flex items-center gap-1">
            {['Monthly', 'Quarterly', 'Yearly'].map((v) => (
              <button
                key={v}
                onClick={() => setTrendView(v)}
                className={`py-1 px-3 rounded-lg text-[10px] font-bold ${
                  trendView === v ? 'bg-[#714B67] text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="spend" name="Spend" fill="#714B67" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Split PO analytics + Invoice analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 6. Purchase Order Analytics */}
        <Card className="space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-2">
            PO creation trend
          </h3>
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs font-semibold">
            <div className="bg-slate-50 p-2.5 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-bold leading-none">Total</span>
              <span className="text-sm font-black text-slate-800 block mt-1">{poStats?.total || 0}</span>
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-2xl">
              <span className="text-[10px] text-emerald-600 block font-bold leading-none">Approved</span>
              <span className="text-sm font-black text-emerald-700 block mt-1">{poStats?.approved || 0}</span>
            </div>
            <div className="bg-rose-50 p-2.5 rounded-2xl">
              <span className="text-[10px] text-rose-600 block font-bold leading-none">Rejected</span>
              <span className="text-sm font-black text-rose-700 block mt-1">{poStats?.rejected || 0}</span>
            </div>
            <div className="bg-purple-50 p-2.5 rounded-2xl">
              <span className="text-[10px] text-[#714B67] block font-bold leading-none">Drafts</span>
              <span className="text-sm font-black text-[#714B67] block mt-1">{poStats?.draft || 0}</span>
            </div>
          </div>

          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="orders" name="Orders Created" stroke="#714B67" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 7. Invoice Analytics */}
        <Card className="space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-2">
            Invoice Processing & Collection
          </h3>
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs font-semibold">
            <div className="bg-slate-50 p-2.5 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-bold leading-none">Paid</span>
              <span className="text-sm font-black text-slate-800 block mt-1">{invoiceStats?.paid || 0}</span>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-2xl">
              <span className="text-[10px] text-amber-600 block font-bold leading-none">Pending</span>
              <span className="text-sm font-black text-amber-700 block mt-1">{invoiceStats?.pending || 0}</span>
            </div>
            <div className="bg-rose-50 p-2.5 rounded-2xl">
              <span className="text-[10px] text-rose-600 block font-bold leading-none">Overdue</span>
              <span className="text-sm font-black text-rose-700 block mt-1">{invoiceStats?.overdue || 0}</span>
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-2xl">
              <span className="text-[10px] text-emerald-600 block font-bold leading-none">Success</span>
              <span className="text-sm font-black text-emerald-700 block mt-1">{invoiceStats?.successRate || 97}%</span>
            </div>
          </div>

          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="invoices" name="Invoices Paid" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 8. Procurement Efficiency Metrics */}
      <Card className="space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-2">
          Procurement Efficiency Metrics (KPIs)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-150">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Average Approval Time
            </span>
            <span className="text-lg font-black text-slate-800 block mt-1">2.3 Days</span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
              From request submission to generation
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-150">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Average Vendor Response Time
            </span>
            <span className="text-lg font-black text-slate-800 block mt-1">1.8 Days</span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
              From RFQ creation to quotation submission
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-150">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Procurement Cycle Duration
            </span>
            <span className="text-lg font-black text-slate-800 block mt-1">5.4 Days</span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
              Average complete workflow turnaround
            </span>
          </div>
        </div>
      </Card>

      {/* 9 & 10. Report Generation Form */}
      <Card className="space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-2">
          Generate Custom Procurement Reports
        </h3>
        <form onSubmit={handleGenerateReport} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Report Type */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none"
            >
              <option value="Vendor Performance Report">Vendor Performance Report</option>
              <option value="Procurement Spend Report">Procurement Spend Report</option>
              <option value="Purchase Order Report">Purchase Order Report</option>
              <option value="Invoice Report">Invoice Report</option>
              <option value="Approval History Report">Approval History Report</option>
              <option value="Audit Report">Audit Report</option>
            </select>
          </div>

          {/* Export Format */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Export Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none"
            >
              <option value="PDF">PDF Document</option>
              <option value="Excel">Excel Sheet</option>
              <option value="CSV">Comma Separated (CSV)</option>
            </select>
          </div>

          {/* Department */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Department
            </label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="IT">IT Hardware</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance & Tax</option>
            </select>
          </div>

          {/* Vendor */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Vendor Limit
            </label>
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none"
            >
              <option value="All">All Vendors</option>
              <option value="TechCore">TechCore Ltd</option>
              <option value="Infra">Infra Supplies</option>
            </select>
          </div>

          {/* Action trigger */}
          <button
            type="submit"
            disabled={generating}
            className="w-full py-2 bg-[#714B67] hover:bg-[#5E3E56] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {generating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Compiling...
              </>
            ) : (
              'Generate Report'
            )}
          </button>
        </form>
      </Card>

      {/* 11. Recent Generated Reports */}
      <Card className="space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-2">
          Recently Generated Reports
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-150 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-5">Report Name</th>
                <th className="py-3 px-5">Generated By</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Format</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
              {!history || history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    No reports generated yet.
                  </td>
                </tr>
              ) : (
                (history || []).map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-5 font-black text-slate-900">{rep.name}</td>
                    <td className="py-3 px-5">{rep.generatedBy}</td>
                    <td className="py-3 px-5 text-slate-500 font-medium font-sans">
                      {new Date(rep.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-5">
                      <Badge variant="neutral">{rep.format}</Badge>
                    </td>
                    <td className="py-3 px-5 text-right space-x-2">
                      <button
                        onClick={() => handleDownloadReport(rep.id)}
                        className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDeleteReport(rep.id)}
                        className="py-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
