import React, { useState, useEffect } from 'react';
import { tradeHistoryAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { getString } from '../utils/i18n';

interface TradeHistoryResponse {
  trades: TradeItem[];
  [key: string]: any; // For any other properties that might be in the response
}

interface TradeItem {
  id: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  items: Array<{
    name: string;
    image: string;
    price: number;
  }>;
  totalAmount: number;
}

const TradeHistory: React.FC = () => {
  const { t } = useLanguage();
  const [trades, setTrades] = useState<TradeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        setLoading(true);
        const data = await tradeHistoryAPI.getTradeHistory() as TradeHistoryResponse | TradeItem[];
        // Handle both array response and object with trades property
        const tradesData = Array.isArray(data) ? data : (data as TradeHistoryResponse)?.trades || [];
        setTrades(tradesData);
      } catch (err) {
        console.error('Error fetching trade history:', err);
        setError(getString(t('tradeHistory.error'), 'Failed to load trade history'));
      } finally {
        setLoading(false);
      }
    };

    fetchTradeHistory();
  }, [t]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        {error}
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        {t('tradeHistory.noTrades') || 'No trade history found'}
      </div>
    );
  }


  return (
    <div className="space-y-4">
      {trades.map((trade) => (
        <div 
          key={trade.id}
          className="bg-[var(--bgColor)] rounded-lg p-4 border border-gray-800 hover:border-[var(--btnColor)] transition-colors duration-200"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-gray-400">
              {new Date(trade.date).toLocaleString()}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(trade.status)}`}>
              {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {trade.items.slice(0, 4).map((item, index) => (
                <div key={index} className="w-10 h-10 rounded-md overflow-hidden border border-gray-700">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {trade.items.length > 4 && (
                <div className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                  +{trade.items.length - 4}
                </div>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-300">
                {trade.items.length} {trade.items.length === 1 ? 'item' : 'items'}
              </div>
              <div className="text-lg font-bold text-[var(--btnColor)]">
                {trade.totalAmount.toFixed(2)} zł
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TradeHistory;
