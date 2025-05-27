import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
// import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface Message {
  sender: 'user' | 'admin';
  content: string;
  timestamp: string;
}

interface TicketDetails {
  _id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  subject: string;
  status: 'open' | 'closed';
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  // const { t } = useLanguage();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate it with a timeout and mock data
        setTimeout(() => {
          const mockTicket: TicketDetails = {
            _id: id || 'ticket1',
            userId: 'user1',
            username: 'SteamUser123',
            avatarUrl: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
            subject: 'Problem z płatnością',
            status: 'open',
            messages: [
              {
                sender: 'user',
                content: 'Cześć, mam problem z płatnością. Wysłałem skiny, ale nie otrzymałem pieniędzy. Proszę o pomoc.',
                timestamp: new Date(Date.now() - 86400000).toISOString()
              },
              {
                sender: 'admin',
                content: 'Dzień dobry, dziękujemy za zgłoszenie. Proszę podać numer transakcji, abyśmy mogli sprawdzić status płatności.',
                timestamp: new Date(Date.now() - 72000000).toISOString()
              },
              {
                sender: 'user',
                content: 'Numer transakcji to #123456. Płatność miała być zrealizowana na konto bankowe.',
                timestamp: new Date(Date.now() - 36000000).toISOString()
              }
            ],
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 36000000).toISOString()
          };
          
          setTicket(mockTicket);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching ticket details:', err);
        setIsLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  useEffect(() => {
    // Scroll to bottom of messages when they change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket?.messages]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    
    setIsSending(true);
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        const newMessage: Message = {
          sender: 'admin',
          content: replyContent,
          timestamp: new Date().toISOString()
        };
        
        setTicket(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, newMessage],
            updatedAt: new Date().toISOString()
          };
        });
        
        setReplyContent('');
        setIsSending(false);
      }, 500);
    } catch (err) {
      console.error('Error sending reply:', err);
      setIsSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!ticket) return;
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        setTicket(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: 'closed',
            updatedAt: new Date().toISOString()
          };
        });
      }, 500);
    } catch (err) {
      console.error('Error closing ticket:', err);
    }
  };

  const handleReopenTicket = async () => {
    if (!ticket) return;
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        setTicket(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: 'open',
            updatedAt: new Date().toISOString()
          };
        });
      }, 500);
    } catch (err) {
      console.error('Error reopening ticket:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Zgłoszenie nie znalezione</h2>
        <p className="mt-2 text-gray-400">Nie znaleziono zgłoszenia o podanym ID.</p>
        <Link to="/admin/tickets" className="mt-4 inline-block bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg">
          Powrót do listy zgłoszeń
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/tickets" className="text-gray-400 hover:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-2xl font-bold">Zgłoszenie #{ticket._id}</h1>
        </div>
        <div>
          {ticket.status === 'open' ? (
            <button
              onClick={handleCloseTicket}
              className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <span className="material-symbols-outlined">archive</span>
              <span>Zamknij zgłoszenie</span>
            </button>
          ) : (
            <button
              onClick={handleReopenTicket}
              className="flex items-center space-x-2 bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined">unarchive</span>
              <span>Otwórz ponownie</span>
            </button>
          )}
        </div>
      </div>

      {/* Ticket Header */}
      <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img 
              src={ticket.avatarUrl} 
              alt={ticket.username} 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <Link 
                to={`/admin/users/${ticket.userId}`}
                className="font-medium hover:text-[var(--btnColor)] hover:underline"
              >
                {ticket.username}
              </Link>
              <p className="text-sm text-gray-400">Utworzono: {formatDate(ticket.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              ticket.status === 'open' 
                ? 'bg-green-500/20 text-green-500' 
                : 'bg-gray-500/20 text-gray-500'
            }`}>
              {ticket.status === 'open' ? 'Otwarte' : 'Zamknięte'}
            </span>
            <span className="text-gray-400">Ostatnia aktualizacja: {formatDate(ticket.updatedAt)}</span>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">{ticket.subject}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-[var(--secondaryBgColor)] rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-6 max-h-[500px] overflow-y-auto">
          <div className="space-y-6">
            {ticket.messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.sender === 'admin' ? 'bg-[var(--btnColor)]/10 text-white' : 'bg-gray-700 text-white'} rounded-lg p-4`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {message.sender === 'user' ? (
                      <>
                        <img 
                          src={ticket.avatarUrl} 
                          alt={ticket.username} 
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="font-medium">{ticket.username}</span>
                      </>
                    ) : (
                      <>
                        <img 
                          src={user?.avatarUrl || 'https://via.placeholder.com/32'} 
                          alt="Admin" 
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="font-medium">Admin</span>
                      </>
                    )}
                    <span className="text-xs text-gray-400">{formatDate(message.timestamp)}</span>
                  </div>
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Reply Form */}
        {ticket.status === 'open' && (
          <div className="p-4 border-t border-gray-800">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full h-32 bg-[var(--bgColor)] border border-gray-700 rounded-lg p-3 text-sm resize-none"
              placeholder="Napisz odpowiedź..."
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleSendReply}
                className="bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center"
                disabled={isSending || !replyContent.trim()}
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2">send</span>
                    <span>Wyślij odpowiedź</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;
