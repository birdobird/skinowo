import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Transaction {
  _id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  items: {
    name: string;
    image: string;
    ourPrice: number;
  }[];
  totalAmount: number;
  paymentMethod: 'bank' | 'paypal' | 'skrill' | 'crypto';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    dateFrom: '',
    dateTo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);

  // Fetch transactions on component mount and when filters or page changes
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call with filters
        // For now, we'll simulate it with a timeout and mock data
        setTimeout(() => {
          const mockTransactions: Transaction[] = Array.from({ length: 20 }, (_, i) => ({
            _id: `transaction${i + 1 + (currentPage - 1) * 20}`,
            userId: `user${Math.floor(Math.random() * 10) + 1}`,
            username: `SteamUser${Math.floor(Math.random() * 100) + 1}`,
            avatarUrl: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
            items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
              name: ['AWP | Asiimov (FT)', 'AK-47 | Redline (FT)', 'M4A4 | Howl (MW)', 'Karambit | Fade (FN)'][Math.floor(Math.random() * 4)],
              image: '/src/assets/awp.png',
              ourPrice: Math.random() * 500 + 50
            })),
            totalAmount: Math.random() * 1000 + 100,
            paymentMethod: ['bank', 'paypal', 'skrill', 'crypto'][Math.floor(Math.random() * 4)] as 'bank' | 'paypal' | 'skrill' | 'crypto',
            status: ['pending', 'completed', 'failed'][Math.floor(Math.random() * 3)] as 'pending' | 'completed' | 'failed',
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            completedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString() : undefined
          }));
          
          // Apply filters (in a real app, this would be done server-side)
          let filtered = [...mockTransactions];
          
          if (filters.status) {
            filtered = filtered.filter(t => t.status === filters.status);
          }
          
          if (filters.paymentMethod) {
            filtered = filtered.filter(t => t.paymentMethod === filters.paymentMethod);
          }
          
          if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filtered = filtered.filter(t => new Date(t.createdAt) >= fromDate);
          }
          
          if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999); // End of the day
            filtered = filtered.filter(t => new Date(t.createdAt) <= toDate);
          }
          
          setTransactions(filtered);
          setTotalPages(5); // Mock total pages
          setTotalTransactions(100); // Mock total transactions
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, filters]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      paymentMethod: '',
      dateFrom: '',
      dateTo: ''
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
                    <th className="px-6 py-3 font-medium">ID</th>
                    <th className="px-6 py-3 font-medium">Użytkownik</th>
                    <th className="px-6 py-3 font-medium">Przedmioty</th>
                    <th className="px-6 py-3 font-medium">Kwota</th>
                    <th className="px-6 py-3 font-medium">Metoda płatności</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Data</th>
                    <th className="px-6 py-3 font-medium">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="px-6 py-4 text-sm">#{transaction._id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={transaction.avatarUrl} 
                            alt={transaction.username} 
                            className="w-8 h-8 rounded-full"
                          />
                          <Link 
                            to={`/admin/users/${transaction.userId}`}
                            className="hover:text-[var(--btnColor)] hover:underline"
                          >
                            {transaction.username}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {transaction.items.map((item, index) => (
                            <img 
                              key={index}
                              src={item.image} 
                              alt={item.name} 
                              className="w-8 h-8 rounded-full border border-gray-800"
                              title={`${item.name} - ${formatCurrency(item.ourPrice)}`}
                            />
                          ))}
                          {transaction.items.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                              +{transaction.items.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{formatCurrency(transaction.totalAmount)}</td>
                      <td className="px-6 py-4 text-sm capitalize">{transaction.paymentMethod}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'completed' 
                            ? 'bg-green-500/20 text-green-500' 
                            : transaction.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {transaction.status === 'completed' 
                            ? 'Zakończona' 
                            : transaction.status === 'pending'
                            ? 'Oczekująca'
                            : 'Anulowana'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{formatDate(transaction.createdAt)}</td>
                      <td className="px-6 py-4 text-sm">
                        <Link 
                          to={`/admin/transactions/${transaction._id}`}
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
