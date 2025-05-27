import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { dashboardStats, fetchDashboardStats, isLoading } = useAdmin();
  const [dataFetched, setDataFetched] = useState(false);
  
  useEffect(() => {
    // Fetch data only once when component mounts
    if (!dataFetched) {
      fetchDashboardStats();
      setDataFetched(true);
    }
  }, [fetchDashboardStats, dataFetched]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel główny</h1>
        <button 
          onClick={() => {
            setDataFetched(false); // Reset flag to allow fetching again
            fetchDashboardStats();
          }}
          className="flex items-center gap-2 bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <span className="material-symbols-outlined"><i className="fa-solid fa-refresh"></i></span>
          <span>Odśwież</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Użytkownicy</p>
              <h3 className="text-2xl font-bold mt-1">{dashboardStats?.totalUsers || 0}</h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <i className="fa-solid fa-users text-blue-500"></i>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/users" className="text-xs text-[var(--btnColor)] hover:underline">Zobacz wszystkich</Link>
          </div>
        </div>

        <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Oczekujące transakcje</p>
              <h3 className="text-2xl font-bold mt-1">{dashboardStats?.pendingTransactions || 0}</h3>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <i className="fa-solid fa-clock text-amber-500"></i>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/transactions?status=pending" className="text-xs text-[var(--btnColor)] hover:underline">Zobacz oczekujące</Link>
          </div>
        </div>

        <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Otwarte zgłoszenia</p>
              <h3 className="text-2xl font-bold mt-1">{dashboardStats?.openTickets || 0}</h3>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <i className="fa-solid fa-headset text-red-500"></i>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/tickets?status=open" className="text-xs text-[var(--btnColor)] hover:underline">Zobacz zgłoszenia</Link>
          </div>
        </div>

        <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Suma sprzedaży</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(dashboardStats?.totalSalesAmount || 0)}</h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <i className="fa-solid fa-money-bill-wave text-green-500"></i>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs text-gray-400">Suma sprzedaży w systemie</span>
          </div>
        </div>
      </div>

      {/* Ostatnie Transakcje */}
      <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Ostatnie transakcje</h2>
          <Link to="/admin/transactions" className="text-sm text-[var(--btnColor)] hover:underline">Zobacz wszystkie</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Użytkownik</th>
                <th className="pb-3 font-medium">Przedmioty</th>
                <th className="pb-3 font-medium">Kwota</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Data</th>
                <th className="pb-3 font-medium">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {dashboardStats?.recentTransactions.map((transaction) => (
                <tr key={transaction._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-3 text-sm">#{transaction._id}</td>
                  <td className="py-3 text-sm">{transaction.username}</td>
                  <td className="py-3 text-sm">
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
                  <td className="py-3 text-sm font-medium">{formatCurrency(transaction.totalAmount)}</td>
                  <td className="py-3 text-sm">
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
                  <td className="py-3 text-sm text-gray-400">{formatDate(transaction.createdAt)}</td>
                  <td className="py-3 text-sm">
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
      </div>

      {/* Ostatnie Zgłoszenia */}
      <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Ostatnie zgłoszenia</h2>
          <Link to="/admin/tickets" className="text-sm text-[var(--btnColor)] hover:underline">Zobacz wszystkie</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Użytkownik</th>
                <th className="pb-3 font-medium">Temat</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Data</th>
                <th className="pb-3 font-medium">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {dashboardStats?.recentTickets.map((ticket) => (
                <tr key={ticket._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-3 text-sm">#{ticket._id}</td>
                  <td className="py-3 text-sm">{ticket.username}</td>
                  <td className="py-3 text-sm">{ticket.subject}</td>
                  <td className="py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ticket.status === 'open' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {ticket.status === 'open' ? 'Otwarte' : 'Zamknięte'}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-400">{formatDate(ticket.createdAt)}</td>
                  <td className="py-3 text-sm">
                    <Link 
                      to={`/admin/tickets/${ticket._id}`}
                      className="text-[var(--btnColor)] hover:underline"
                    >
                      Odpowiedz
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
