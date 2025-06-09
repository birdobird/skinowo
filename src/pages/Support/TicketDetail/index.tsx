import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

interface Message {
  id?: string | number;
  _id?: string | number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId?: string | number;
  isAdmin?: boolean;
  isInitial?: boolean;
}

interface Ticket {
  id?: string;
  _id?: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
  [key: string]: any;
}

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/support/ticket/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch ticket');
        
        const data = await response.json();
        
        if (data.success) {
          // Check if data is nested under 'ticket' property
          const responseData = data.ticket || data;
          
          // Create a normalized ticket object
          const normalizedTicket = {
            ...responseData,
            // Ensure we have a messages array
            messages: responseData.messages || []
          };
          
          // Add initial message to messages array if it exists and isn't already there
          if (responseData.message && !normalizedTicket.messages.some((m: any) => m.isInitial)) {
            normalizedTicket.messages.unshift({
              id: 'initial',
              content: responseData.message,
              createdAt: responseData.createdAt,
              updatedAt: responseData.updatedAt || responseData.createdAt,
              userId: responseData.userId,
              isInitial: true
            });
          }

          setTicket(normalizedTicket);
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
        toast.error('Nie udało się załadować zgłoszenia');
        navigate('/support');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTicket();
  }, [id, navigate]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !ticket || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const ticketId = ticket.id || ticket._id || id;
      if (!ticketId) {
        throw new Error('Brak identyfikatora zgłoszenia');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/support/ticket/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nie udało się wysłać wiadomości');
      }

      const data = await response.json();
      
      // Refresh the ticket to get the latest data
      const ticketResponse = await fetch(`${import.meta.env.VITE_API_URL}/support/ticket/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (ticketResponse.ok) {
        const ticketData = await ticketResponse.json();
        setTicket(ticketData.ticket || ticketData);
      } else {
        // If refresh fails, try to update locally
        setTicket(prev => ({
          ...prev!,
          messages: [...(prev?.messages || []), data],
          updatedAt: new Date().toISOString()
        }));
      }
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error instanceof Error ? error.message : 'Wystąpił błąd podczas wysyłania wiadomości');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 relative z-10 text-center py-12">
        <h2 className="text-xl font-semibold">Zgłoszenie nie znalezione</h2>
        <p className="mt-2 text-gray-400">Nie znaleziono zgłoszenia o podanym ID.</p>
        <Link 
          to="/support" 
          className="mt-4 inline-block bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg hover:opacity-90"
        >
          Powrót do listy zgłoszeń
        </Link>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 relative z-10 text-center py-12">
        <h2 className="text-xl font-semibold">Błąd ładowania zgłoszenia</h2>
        <p className="mt-2 text-gray-400">Nie udało się załadować danych zgłoszenia.</p>
      </div>
    );
  }

  return (
    <div className="container py-12 px-4 relative z-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Zgłoszenie #{ticket.id || ticket._id}</h1>
        <Link 
          to="/support" 
          className="text-gray-400 hover:text-white flex items-center"
        >
          <span className="mr-1">←</span> Powrót
        </Link>
      </div>

      <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold">{ticket.subject}</h2>
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-400">
              <span>Utworzono: {formatDate(ticket.createdAt)}</span>
              <span>Status: 
                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                  ticket.status === 'open' ? 'bg-yellow-500/20 text-yellow-500' :
                  ticket.status === 'in-progress' ? 'bg-blue-500/20 text-blue-500' :
                  'bg-green-500/20 text-green-500'
                }`}>
                  {ticket.status === 'open' ? 'Otwarte' :
                   ticket.status === 'in-progress' ? 'W toku' : 'Zamknięte'}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="font-medium">Wiadomości:</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
            {ticket.messages && ticket.messages.length > 0 ? (
              <div className="space-y-4">
                {ticket.messages.map((msg, index) => {
                  const isCurrentUser = String(msg.userId) === String(user?.id) || 
                                    (msg.isInitial && String(ticket.userId) === String(user?.id));
                  
                  return (
                    <div 
                      key={`${msg.id}-${index}`}
                      className={`p-4 rounded-lg ${
                        isCurrentUser
                          ? 'bg-[var(--btnColor)]/10 ml-8' 
                          : 'bg-[var(--bgColor)] mr-8'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium">
                          {isCurrentUser ? 'Ty' : msg.isAdmin ? 'Obsługa' : 'Użytkownik'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(msg.createdAt || msg.updatedAt || new Date().toISOString())}
                        </div>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap">{msg.content || '(Brak treści)'}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {msg.id} | UserID: {msg.userId} | {msg.isInitial ? 'Initial' : 'Response'}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">Brak wiadomości</p>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Wpisz wiadomość..."
              className="flex-1 bg-[var(--bgColor)] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--btnColor)]"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!message.trim() || isSubmitting}
              className="bg-[var(--btnColor)] text-black px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Wysyłanie...' : 'Wyślij'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketDetail;
