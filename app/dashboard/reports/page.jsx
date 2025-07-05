"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  getSalesAnalytics,
  getInventoryAnalytics,
  getCustomerAnalytics,
} from "@/app/utils/api";

const StatCard = ({ title, value, icon, color, change, changeType }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {changeType === 'positive' ? '+' : ''}{change} from last period
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const AnalyticsChart = ({ title, data, type = "bar" }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="h-64 flex items-end justify-between space-x-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className="w-full bg-primary-500 rounded-t"
            style={{
              height: `${(item.value / Math.max(...data.map(d => d.value))) * 200}px`,
            }}
          ></div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const DataTable = ({ title, data, columns }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("sales");
  const [period, setPeriod] = useState("30");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [customerData, setCustomerData] = useState(null);

  const tabs = [
    { id: "sales", label: "Sales Analytics", icon: TrendingUp },
    { id: "inventory", label: "Inventory Reports", icon: Package },
    { id: "customers", label: "Customer Insights", icon: Users },
  ];

  const periods = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" },
    { value: "365", label: "Last year" },
  ];

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sales, inventory, customers] = await Promise.all([
        getSalesAnalytics(period),
        getInventoryAnalytics(),
        getCustomerAnalytics(period),
      ]);
      setSalesData(sales);
      setInventoryData(inventory);
      setCustomerData(customers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (type) => {
    // TODO: Implement export functionality
    console.log(`Exporting ${type} data`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-semibold text-gray-600">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-xl font-semibold mb-2">Error Loading Reports</div>
        <div className="text-red-700">{error}</div>
        <button
          onClick={fetchData}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into your business performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {periods.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <button
            onClick={fetchData}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sales Analytics Tab */}
      {activeTab === "sales" && salesData && (
        <div className="space-y-6">
          {/* Sales Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Revenue"
              value={`৳${salesData.analytics.totalRevenue.toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6 text-green-600" />}
              color="bg-green-100"
              change="12.5%"
              changeType="positive"
            />
            <StatCard
              title="Total Orders"
              value={salesData.analytics.totalOrders}
              icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
              color="bg-blue-100"
              change="8.2%"
              changeType="positive"
            />
            <StatCard
              title="Average Order Value"
              value={`৳${salesData.analytics.avgOrderValue.toFixed(2)}`}
              icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
              color="bg-purple-100"
              change="5.1%"
              changeType="positive"
            />
          </div>

          {/* Sales Chart */}
          {salesData.analytics.dailySales.length > 0 && (
            <AnalyticsChart
              title="Daily Sales Trend"
              data={salesData.analytics.dailySales.map((day) => ({
                label: new Date(day.date).toLocaleDateString(),
                value: day.revenue,
              }))}
            />
          )}

          {/* Top Products */}
          {salesData.analytics.topProducts.length > 0 && (
            <DataTable
              title="Top Selling Products"
              data={salesData.analytics.topProducts}
              columns={[
                { key: "name", label: "Product Name" },
                { key: "quantity", label: "Units Sold" },
                {
                  key: "revenue",
                  label: "Revenue",
                  render: (value) => `৳${value.toLocaleString()}`,
                },
              ]}
            />
          )}
        </div>
      )}

      {/* Inventory Reports Tab */}
      {activeTab === "inventory" && inventoryData && (
        <div className="space-y-6">
          {/* Inventory Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Products"
              value={inventoryData.inventory.summary.totalProducts}
              icon={<Package className="w-6 h-6 text-blue-600" />}
              color="bg-blue-100"
            />
            <StatCard
              title="Active Products"
              value={inventoryData.inventory.summary.activeProducts}
              icon={<Package className="w-6 h-6 text-green-600" />}
              color="bg-green-100"
            />
            <StatCard
              title="Out of Stock"
              value={inventoryData.inventory.summary.outOfStock}
              icon={<Package className="w-6 h-6 text-red-600" />}
              color="bg-red-100"
            />
            <StatCard
              title="Low Stock"
              value={inventoryData.inventory.summary.lowStock}
              icon={<Package className="w-6 h-6 text-yellow-600" />}
              color="bg-yellow-100"
            />
          </div>

          {/* Low Stock Products */}
          {inventoryData.inventory.lowStockProducts.length > 0 && (
            <DataTable
              title="Low Stock Products"
              data={inventoryData.inventory.lowStockProducts}
              columns={[
                { key: "name", label: "Product Name" },
                { key: "category", label: "Category" },
                { key: "stock", label: "Current Stock" },
                { key: "threshold", label: "Threshold" },
              ]}
            />
          )}

          {/* Out of Stock Products */}
          {inventoryData.inventory.outOfStockProducts.length > 0 && (
            <DataTable
              title="Out of Stock Products"
              data={inventoryData.inventory.outOfStockProducts}
              columns={[
                { key: "name", label: "Product Name" },
                { key: "category", label: "Category" },
                {
                  key: "price",
                  label: "Price",
                  render: (value) => `৳${value}`,
                },
              ]}
            />
          )}

          {/* Category Inventory */}
          {inventoryData.inventory.categoryInventory.length > 0 && (
            <DataTable
              title="Inventory by Category"
              data={inventoryData.inventory.categoryInventory}
              columns={[
                { key: "name", label: "Category" },
                { key: "total", label: "Total Products" },
                { key: "active", label: "Active" },
                { key: "outOfStock", label: "Out of Stock" },
              ]}
            />
          )}
        </div>
      )}

      {/* Customer Insights Tab */}
      {activeTab === "customers" && customerData && (
        <div className="space-y-6">
          {/* Customer Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Customers"
              value={customerData.customers.summary.totalCustomers}
              icon={<Users className="w-6 h-6 text-blue-600" />}
              color="bg-blue-100"
            />
            <StatCard
              title="New Customers"
              value={customerData.customers.summary.newCustomers}
              icon={<Users className="w-6 h-6 text-green-600" />}
              color="bg-green-100"
              change="15.3%"
              changeType="positive"
            />
            <StatCard
              title="Active Customers"
              value={customerData.customers.summary.activeCustomers}
              icon={<Users className="w-6 h-6 text-purple-600" />}
              color="bg-purple-100"
              change="8.7%"
              changeType="positive"
            />
          </div>

          {/* Customer Registration Trend */}
          {customerData.customers.registrationTrend.length > 0 && (
            <AnalyticsChart
              title="Customer Registration Trend"
              data={customerData.customers.registrationTrend.map((day) => ({
                label: new Date(day.date).toLocaleDateString(),
                value: day.count,
              }))}
            />
          )}

          {/* Top Customers */}
          {customerData.customers.topCustomers.length > 0 && (
            <DataTable
              title="Top Customers by Revenue"
              data={customerData.customers.topCustomers}
              columns={[
                { key: "name", label: "Customer Name" },
                { key: "email", label: "Email" },
                { key: "orders", label: "Total Orders" },
                {
                  key: "totalSpent",
                  label: "Total Spent",
                  render: (value) => `৳${value.toLocaleString()}`,
                },
              ]}
            />
          )}
        </div>
      )}

      {/* Export Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => handleExport("sales")}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <Download size={16} />
            <span>Export Sales Report</span>
          </button>
          <button
            onClick={() => handleExport("inventory")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Download size={16} />
            <span>Export Inventory Report</span>
          </button>
          <button
            onClick={() => handleExport("customers")}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            <Download size={16} />
            <span>Export Customer Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
