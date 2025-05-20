import React, { useState } from 'react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from 'components/ui/dialog';
import { Label } from 'components/ui/label';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({ username: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const handleAddOrUpdateUser = () => {
    if (!newUser.username || !newUser.email) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (isEditing && editingUserId) {
      setUsers(users.map(user => user.id === editingUserId ? { ...user, ...newUser, id: editingUserId } as User : user));
      toast.success('Usuário atualizado com sucesso');
    } else {
      const newUserComplete: User = {
        id: Date.now().toString(),
        username: newUser.username!,
        email: newUser.email!
      };
      setUsers([...users, newUserComplete]);
      toast.success('Usuário criado com sucesso');
    }

    setNewUser({ username: '', email: '' });
    setIsDialogOpen(false);
    setIsEditing(false);
    setEditingUserId(null);
  };

  const handleEditUser = (user: User) => {
    setIsEditing(true);
    setEditingUserId(user.id);
    setNewUser({ username: user.username, email: user.email });
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      setUsers(users.filter(user => user.id !== id));
      toast.success('Usuário deletado com sucesso');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h2>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">
            {isEditing ? 'Editar Usuário' : 'Cadastrar Usuário'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Usuário' : 'Cadastrar Usuário'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                id="username"
                value={newUser.username || ''}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email || ''}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <Button onClick={handleAddOrUpdateUser} className="w-full">
              {isEditing ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left">Nome de Usuário</th>
            <th className="border border-gray-300 p-2 text-left">Email</th>
            <th className="border border-gray-300 p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border border-gray-300 p-2">{user.username}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2 space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>Editar</Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>Deletar</Button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center p-4 text-gray-500">Nenhum usuário cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
