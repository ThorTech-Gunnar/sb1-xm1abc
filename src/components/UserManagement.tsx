import React, { useState, useEffect } from 'react';
import { User, Edit, Trash2, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Button, TextInput, Select, SelectItem } from '@tremor/react';
import api from '../utils/api';

interface UserData {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  firstName: string;
  lastName: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [newUser, setNewUser] = useState({ email: '', role: 'staff', firstName: '', lastName: '' });
  const { theme } = useTheme();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      fetchUsers();
      setIsAddingUser(false);
      setNewUser({ email: '', role: 'staff', firstName: '', lastName: '' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      try {
        await api.put(`/users/${editingUser.id}`, editingUser);
        fetchUsers();
        setEditingUser(null);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <Card>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div className="sm:flex-auto">
          <Title>User Management</Title>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            icon={Plus}
            onClick={() => setIsAddingUser(true)}
            style={{ backgroundColor: theme.primaryColor }}
          >
            Add New User
          </Button>
        </div>
      </div>

      {(isAddingUser || editingUser) && (
        <Card className="mb-6">
          <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <TextInput
                  placeholder="First Name"
                  value={editingUser ? editingUser.firstName : newUser.firstName}
                  onChange={(e) => editingUser ? setEditingUser({...editingUser, firstName: e.target.value}) : setNewUser({...newUser, firstName: e.target.value})}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <TextInput
                  placeholder="Last Name"
                  value={editingUser ? editingUser.lastName : newUser.lastName}
                  onChange={(e) => editingUser ? setEditingUser({...editingUser, lastName: e.target.value}) : setNewUser({...newUser, lastName: e.target.value})}
                  required
                />
              </div>
              <div className="sm:col-span-4">
                <TextInput
                  placeholder="Email"
                  type="email"
                  value={editingUser ? editingUser.email : newUser.email}
                  onChange={(e) => editingUser ? setEditingUser({...editingUser, email: e.target.value}) : setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Select
                  value={editingUser ? editingUser.role : newUser.role}
                  onValueChange={(value) => editingUser ? setEditingUser({...editingUser, role: value as UserData['role']}) : setNewUser({...newUser, role: value as UserData['role']})}
                >
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </Select>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button variant="secondary" onClick={() => {
                setIsAddingUser(false);
                setEditingUser(null);
              }}>
                Cancel
              </Button>
              <Button type="submit" style={{ backgroundColor: theme.primaryColor }}>
                {editingUser ? 'Update User' : 'Add User'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstName} {user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge color={user.role === 'admin' ? 'red' : user.role === 'manager' ? 'yellow' : 'green'}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  icon={Edit}
                  variant="secondary"
                  onClick={() => setEditingUser(user)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  icon={Trash2}
                  variant="secondary"
                  onClick={() => handleDeleteUser(user.id)}
                  color="red"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UserManagement;