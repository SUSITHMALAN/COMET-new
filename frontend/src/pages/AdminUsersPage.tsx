import React, { useEffect, useState } from 'react';
import { UserX, UserCheck, Users } from 'lucide-react';
import { usersApi } from '../api';
import { User } from '../types';
import { showToast } from '../hooks/useToast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    usersApi.getAll().then(res => setUsers(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (user: User) => {
    await usersApi.update(user.id, { is_active: !user.is_active });
    showToast(`User ${user.is_active ? 'deactivated' : 'activated'}`, 'success');
    fetchUsers();
  };

  const customers = users.filter(u => u.role === 'user');
  const admins = users.filter(u => u.role === 'admin');

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', letterSpacing: '0.06em' }}>USERS</h1>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'center', padding: '12px 24px', background: 'var(--white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ fontSize: '24px', fontWeight: 700 }}>{customers.length}</p>
            <p style={{ fontSize: '12px', color: 'var(--grey-500)' }}>Customers</p>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 24px', background: 'var(--white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ fontSize: '24px', fontWeight: 700 }}>{users.filter(u => u.is_active).length}</p>
            <p style={{ fontSize: '12px', color: 'var(--grey-500)' }}>Active</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
      ) : (
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--grey-100)' }}>
                {['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--grey-500)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '14px' }}>{user.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--grey-600)' }}>{user.email}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--grey-500)' }}>{user.phone || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 2, fontSize: '11px', fontWeight: 700,
                      background: user.role === 'admin' ? '#ede9fe' : '#f5f5f5',
                      color: user.role === 'admin' ? '#5b21b6' : '#525252',
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 2, fontSize: '11px', fontWeight: 700,
                      background: user.is_active ? '#dcfce7' : '#fee2e2',
                      color: user.is_active ? '#15803d' : '#991b1b',
                    }}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--grey-400)' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {user.role !== 'admin' && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleToggle(user)}
                        title={user.is_active ? 'Deactivate' : 'Activate'}
                        style={{ padding: '6px 10px', color: user.is_active ? 'var(--error)' : 'var(--success)' }}
                      >
                        {user.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 60, textAlign: 'center', color: 'var(--grey-400)' }}>No users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
