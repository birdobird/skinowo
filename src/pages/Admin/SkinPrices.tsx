import React, { useState, useEffect } from 'react';
import AdminPriceUpdater from '../../components/AdminPriceUpdater';
import skinportService from '../../services/skinportService';
import { toast } from 'react-toastify';

const SkinPrices: React.FC = () => {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPrices, setFilteredPrices] = useState<any[]>([]);

  useEffect(() => {
    fetchPrices();
  }, []);

  useEffect(() => {
    if (prices.length > 0 && searchTerm) {
      const filtered = prices.filter(item => 
        item.market_hash_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPrices(filtered);
    } else {
      setFilteredPrices(prices);
    }
  }, [searchTerm, prices]);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const data = await skinportService.getItemPrices();
      setPrices(data);
      setFilteredPrices(data);
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast.error('Failed to load prices from Skinport');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Skin Price Management</h1>
      
      {/* Admin Price Updater Component */}
      <AdminPriceUpdater />
      
      {/* Price List */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Current Skinport Prices</h2>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search skins..."
              className="border border-gray-300 rounded-md px-3 py-2 text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={fetchPrices}
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPrices.length > 0 ? (
                    filteredPrices.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.market_hash_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">€{item.suggested_price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{item.min_price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{item.max_price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.updated_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchTerm ? 'No items match your search' : 'No price data available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredPrices.length} of {prices.length} items
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SkinPrices;
