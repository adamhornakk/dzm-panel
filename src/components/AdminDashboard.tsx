'use client'

import { useState } from 'react'
import { User, Profile, UserRequest } from '@prisma/client'
import { getProfileImage } from '@/lib/imageUtils'

interface AdminDashboardProps {
  pendingRequests: UserRequest[]
  users: (User & { profile: Profile | null })[]
}

export default function AdminDashboard({ pendingRequests, users }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'requests' | 'users'>('requests')
  const [requests, setRequests] = useState(pendingRequests)
  const [message, setMessage] = useState('')
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const handleApproveRequest = async (requestId: string) => {
    try {
      const response = await fetch('/api/admin/approve-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      })

      if (response.ok) {
        setRequests(prev => prev.filter(req => req.id !== requestId))
        setMessage('Žádost byla schválena a uživatel byl vytvořen')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const data = await response.json()
        setMessage(data.message || 'Chyba při schvalování žádosti')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('Chyba při schvalování žádosti')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch('/api/admin/reject-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      })

      if (response.ok) {
        setRequests(prev => prev.filter(req => req.id !== requestId))
        setMessage('Žádost byla zamítnuta')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const data = await response.json()
        setMessage(data.message || 'Chyba při zamítání žádosti')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('Chyba při zamítání žádosti')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Opravdu chcete smazat tohoto uživatele?')) return

    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        setMessage('Uživatel byl smazán')
        setTimeout(() => setMessage(''), 3000)
        // Refresh the page to update the user list
        window.location.reload()
      } else {
        const data = await response.json()
        setMessage(data.message || 'Chyba při mazání uživatele')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('Chyba při mazání uživatele')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'MEMBER' : 'ADMIN'
    
    try {
      const response = await fetch('/api/admin/update-user-role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      })

      if (response.ok) {
        setMessage(`Role uživatele byla změněna na ${newRole}`)
        setTimeout(() => setMessage(''), 3000)
        // Refresh the page to update the user list
        window.location.reload()
      } else {
        const data = await response.json()
        setMessage(data.message || 'Chyba při změně role')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('Chyba při změně role')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleResetPassword = async (userId: string) => {
    if (!confirm('Opravdu chcete resetovat heslo tohoto uživatele?')) return;

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setMessage('Heslo bylo úspěšně resetováno');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Chyba při resetování hesla');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Chyba při resetování hesla');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
        }),
      });

      if (response.ok) {
        setMessage('Uživatel byl úspěšně vytvořen');
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setTimeout(() => {
          setMessage('');
          window.location.reload();
        }, 3000);
      } else {
        const error = await response.json();
        setMessage(`Chyba při vytváření uživatele: ${error.message}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Chyba při vytváření uživatele');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map(user => user.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0) {
      setMessage('Vyberte prosím alespoň jednoho uživatele');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (!confirm(`Opravdu chcete smazat ${selectedUserIds.length} vybraných uživatelů?`)) return;

    try {
      const response = await fetch('/api/admin/bulk-delete-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedUserIds }),
      });

      if (response.ok) {
        setMessage('Vybraní uživatelé byli smazáni');
        setSelectedUserIds([]);
        setTimeout(() => {
          setMessage('');
          window.location.reload();
        }, 3000);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Chyba při mazání uživatelů');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Chyba při mazání uživatelů');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleBulkResetPassword = async () => {
    if (selectedUserIds.length === 0) {
      setMessage('Vyberte prosím alespoň jednoho uživatele');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (!confirm(`Opravdu chcete resetovat hesla pro ${selectedUserIds.length} vybraných uživatelů?`)) return;

    try {
      const response = await fetch('/api/admin/bulk-reset-passwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedUserIds }),
      });

      if (response.ok) {
        setMessage('Hesla vybraných uživatelů byla resetována');
        setSelectedUserIds([]);
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Chyba při resetování hesel');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch {
      setMessage('Chyba při resetování hesel');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-md">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Žádosti o přístup ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Všichni uživatelé ({users.length})
          </button>
        </nav>
      </div>

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Žádné čekající žádosti
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {request.name}
                    </h3>
                    <p className="text-gray-600">{request.email}</p>
                    {request.message && (
                      <p className="mt-2 text-gray-700">{request.message}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Odesláno: {new Date(request.createdAt).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleApproveRequest(request.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                    >
                      Schválit
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                    >
                      Zamítnout
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          {/* Create User Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vytvořit nového uživatele</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="newUserName" className="block text-sm font-medium text-gray-700">
                    Celé jméno
                  </label>
                  <input
                    type="text"
                    id="newUserName"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newUserEmail" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="newUserEmail"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newUserPassword" className="block text-sm font-medium text-gray-700">
                    Heslo
                  </label>
                  <input
                    type="password"
                    id="newUserPassword"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Vytvořit uživatele
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBulkDelete}
                  disabled={selectedUserIds.length === 0}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Smazat vybrané ({selectedUserIds.length})
                </button>
                <button
                  onClick={handleBulkResetPassword}
                  disabled={selectedUserIds.length === 0}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resetovat hesla vybraným ({selectedUserIds.length})
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        onChange={handleSelectAllUsers}
                        checked={selectedUserIds.length === users.length && users.length > 0}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uživatel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registrován
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akce
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {getProfileImage(user, 'small') ? (
                              <img
                                src={getProfileImage(user, 'small')}
                                alt={user.name || 'User'}
                                className="h-10 w-10 rounded-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-blue-600 font-semibold">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'Bez jména'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'ADMIN' ? 'Admin' : 'Člen'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('cs-CZ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleToggleUserRole(user.id, user.role)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {user.role === 'ADMIN' ? 'Odebrat admin' : 'Udělit admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Smazat
                        </button>
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Resetovat heslo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
