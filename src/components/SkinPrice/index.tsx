import React, { useState, useEffect } from 'react';
import skinportService from '../../services/skinportService';
import type { SkinportItem } from '../../services/skinportService';
import { toast } from 'react-toastify';

interface SkinPriceProps {
  marketHashName: string;
  showRefresh?: boolean;
}

const SkinPrice: React.FC<SkinPriceProps> = ({ marketHashName, showRefresh = false }) => {
  const [priceData, setPriceData] = useState<SkinportItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await skinportService.getItemPrice(marketHashName);
      setPriceData(data);
    } catch (err) {
      console.error('Error fetching price:', err);
      setError('Failed to load price data');
      toast.error('Failed to load price data from Skinport');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (marketHashName) {
      fetchPrice();
    }
  }, [marketHashName]);

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading price...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (!priceData) {
    return (
      <div className="flex items-center">
        <span className="text-gray-400 text-sm">No price data available</span>
        {showRefresh && (
          <button
            onClick={fetchPrice}
            className="ml-2 text-blue-500 hover:text-blue-700"
            title="Refresh price"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <span className="font-medium text-green-600">€{priceData.suggested_price.toFixed(2)}</span>
        {showRefresh && (
          <button
            onClick={fetchPrice}
            className="ml-2 text-blue-500 hover:text-blue-700"
            title="Refresh price"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
      <div className="text-xs text-gray-500">
        <span>Quantity: {priceData.quantity}</span>
        <span className="mx-1">|</span>
        <span title="Last updated">
          {new Date(priceData.updated_at).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default SkinPrice;
