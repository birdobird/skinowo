import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';
import { toast } from 'react-toastify';

interface TransactionItem {
  id: string;
  name: string;
  image: string;
  price: number;
  assetId: string;
}

interface Transaction {
  id: number;
  userId: number;
  user: {
    id: number;
    displayName: string;
    avatarUrl: string;
    steamId: string;
  };
  type: 'sale' | 'purchase' | 'withdrawal' | 'deposit';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  fee: number;
  currency: string;
  items: TransactionItem[];
  paymentMethod?: string;
  paymentDetails?: any;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface Filters {
  status: string;
  type: string;
  paymentMethod: string;
  dateFrom: string;
  dateTo: string;
  userId: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    status: '',
    type: '',
    paymentMethod: '',
    dateFrom: '',
    dateTo: '',
    userId: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const limit = 20;

  // Fetch transactions on component mount and when filters or page changes
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await adminAPI.getTransactions(
          currentPage,
          limit,
          filters.userId || undefined
        );
        
        // Log the response to check its structure
        console.log('Transactions API Response:', response);
        
        // Handle response with success flag
        if (response && response.success) {
          setTransactions(response.transactions || response.data || []);
          setTotalPages(response.pagination?.pages || 1);
          setTotalTransactions(response.pagination?.total || (response.transactions ? response.transactions.length : 0));
        } 
        // Fallback for array response (for backward compatibility)
        else if (Array.isArray(response)) {
          setTransactions(response);
          setTotalPages(1);
          setTotalTransactions(response.length);
        } 
        // Fallback for unexpected response format
        else {
          console.warn('Unexpected response format:', response);
          setTransactions([]);
          setTotalPages(1);
          setTotalTransactions(0);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Wystąpił błąd podczas pobierania transakcji');
        setTransactions([]);
        setTotalPages(1);
        setTotalTransactions(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, filters]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency = 'PLN') => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/50 text-green-300';
      case 'failed':
        return 'bg-red-900/50 text-red-300';
      case 'cancelled':
        return 'bg-gray-700/50 text-gray-300';
      case 'pending':
      default:
        return 'bg-yellow-900/50 text-yellow-300';
    }
  };

  const getTypeBadge = (type: string) => {
    const types: Record<string, { text: string; class: string }> = {
      sale: { text: 'Sprzedaż', class: 'bg-green-900/50 text-green-300' },
      purchase: { text: 'Zakup', class: 'bg-blue-900/50 text-blue-300' },
      withdrawal: { text: 'Wypłata', class: 'bg-purple-900/50 text-purple-300' },
      deposit: { text: 'Wpłata', class: 'bg-yellow-900/50 text-yellow-300' },
    };
    
    const typeInfo = types[type] || { text: type, class: 'bg-gray-700/50 text-gray-300' };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${typeInfo.class}`}>
        {typeInfo.text}
      </span>
    );
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      type: '',
      paymentMethod: '',
      dateFrom: '',
      dateTo: '',
      userId: ''
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Transakcje</h1>
      </div>

      {/* Filters */}
      <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Filtry</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full bg-[var(--bgColor)] border border-gray-700 rounded-lg p-2 text-sm"
            >
              <option value="">Wszystkie</option>
              <option value="pending">Oczekujące</option>
              <option value="completed">Zakończone</option>
              <option value="failed">Anulowane</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Typ</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full bg-[var(--bgColor)] border border-gray-700 rounded-lg p-2 text-sm"
            >
              <option value="">Wszystkie</option>
              <option value="sale">Sprzedaż</option>
              <option value="purchase">Zakup</option>
              <option value="withdrawal">Wypłata</option>
              <option value="deposit">Wpłata</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Metoda płatności</label>
            <select
              name="paymentMethod"
              value={filters.paymentMethod}
              onChange={handleFilterChange}
              className="w-full bg-[var(--bgColor)] border border-gray-700 rounded-lg p-2 text-sm"
            >
              <option value="">Wszystkie</option>
              <option value="bank">Przelew bankowy</option>
              <option value="paypal">PayPal</option>
              <option value="skrill">Skrill</option>
              <option value="crypto">Kryptowaluty</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Data od</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full bg-[var(--bgColor)] border border-gray-700 rounded-lg p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Data do</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full bg-[var(--bgColor)] border border-gray-700 rounded-lg p-2 text-sm"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            Resetuj filtry
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[var(--secondaryBgColor)] rounded-xl border border-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-gray-800 bg-gray-800/30">
                    <th className="px-6 py-3 font-medium text-left">ID</th>
                    <th className="px-6 py-3 font-medium text-left">Typ</th>
                    <th className="px-6 py-3 font-medium text-left">Użytkownik</th>
                    <th className="px-6 py-3 font-medium text-right">Kwota</th>
                    <th className="px-6 py-3 font-medium text-center">Status</th>
                    <th className="px-6 py-3 font-medium text-center">Data</th>
                    <th className="px-6 py-3 font-medium text-center">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="px-6 py-4">
                        <Link 
                          to={`/admin/transactions/${transaction.id}`}
                          className="text-[var(--btnColor)] hover:underline font-mono"
                        >
                          #{transaction.id.toString().padStart(6, '0')}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {getTypeBadge(transaction.type)}
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          to={`/admin/users/${transaction.user.id}`}
                          className="flex items-center space-x-2 group"
                        >
                          <img 
                            src={transaction.user.avatarUrl || '/default-avatar.png'} 
                            alt={transaction.user.displayName}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/default-avatar.png';
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="group-hover:text-[var(--btnColor)] transition-colors">
                              {transaction.user.displayName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {transaction.user.steamId}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {formatCurrency(transaction.amount, transaction.currency)}
                        {transaction.fee > 0 && (
                          <div className="text-xs text-gray-400">
                            Opłata: {formatCurrency(transaction.fee, transaction.currency)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(transaction.status)}`}>
                          {transaction.status === 'completed' ? 'Zakończona' : 
                           transaction.status === 'pending' ? 'Oczekująca' :
                           transaction.status === 'cancelled' ? 'Anulowana' : 'Nieudana'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-400">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link 
                          to={`/admin/transactions/${transaction.id}`}
                          className="text-[var(--btnColor)] hover:underline"
                        >
                          Szczegóły
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
              <div className="text-sm text-gray-400">
                Pokazuje {(currentPage - 1) * 20 + 1} - {Math.min(currentPage * 20, totalTransactions)} z {totalTransactions} transakcji
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === 1
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-[var(--btnColor)] text-black hover:opacity-90'
                  }`}
                >
                  Poprzednia
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === page
                        ? 'bg-[var(--btnColor)] text-black'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === totalPages
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-[var(--btnColor)] text-black hover:opacity-90'
                  }`}
                >
                  Następna
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
