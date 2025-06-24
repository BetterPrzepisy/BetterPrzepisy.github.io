import React, { useState } from 'react';
import { Search, UserPlus, Check, X, Users } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

const FriendsPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    friends, 
    friendRequests, 
    searchUsers, 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest 
  } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchUsers(query).filter(u => u.id !== user?.id);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const pendingRequests = friendRequests.filter(req => 
    req.toUserId === user?.id && req.status === 'pending'
  );

  const isAlreadyFriend = (userId: string) => {
    return friends.some(friend => friend.id === userId);
  };

  const hasPendingRequest = (userId: string) => {
    return friendRequests.some(req => 
      req.fromUserId === user?.id && req.toUserId === userId && req.status === 'pending'
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Znajomi</h1>
        <p className="text-gray-600">Zarządzaj swoimi znajomymi i odkrywaj nowych użytkowników</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Znajdź nowych znajomych</h2>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="Wyszukaj użytkowników po nazwie..."
          />
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-3">
            {searchResults.map((searchUser) => (
              <div key={searchUser.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{searchUser.username}</p>
                    <p className="text-sm text-gray-600">{searchUser.email}</p>
                  </div>
                </div>
                
                {isAlreadyFriend(searchUser.id) ? (
                  <span className="text-green-600 font-medium">Znajomy</span>
                ) : hasPendingRequest(searchUser.id) ? (
                  <span className="text-yellow-600 font-medium">Zaproszenie wysłane</span>
                ) : (
                  <button
                    onClick={() => sendFriendRequest(searchUser.id)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Dodaj
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Friend Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Zaproszenia do znajomych ({pendingRequests.length})
          </h2>
          
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{request.fromUsername}</p>
                    <p className="text-sm text-gray-600">
                      Wysłano {new Date(request.createdAt).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => acceptFriendRequest(request.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Akceptuj
                  </button>
                  <button
                    onClick={() => rejectFriendRequest(request.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Odrzuć
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Moi znajomi ({friends.length})
        </h2>
        
        {friends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{friend.username}</p>
                  <p className="text-sm text-gray-600">{friend.email}</p>
                  {friend.bio && (
                    <p className="text-sm text-gray-500 mt-1">{friend.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Brak znajomych
            </h3>
            <p className="text-gray-600">
              Wyszukaj innych użytkowników i zaproś ich do znajomych!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;