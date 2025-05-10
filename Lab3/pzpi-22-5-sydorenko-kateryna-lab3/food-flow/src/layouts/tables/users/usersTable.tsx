'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/providers/authProvider';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  createUserThunk,
  deleteUserThunk,
  fetchUsers,
  selectUsers,
  updateUserThunk,
} from '@/services/users/slice';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function UserTableView() {
  const t = useTranslations('UserTable');
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    spotId: '',
  });

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    dispatch(fetchUsers(token));
  }, [dispatch]);

  const openCreateDialog = () => {
    setForm({ firstName: '', lastName: '', email: '', password: '', role: '', spotId: '' });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEditDialog = (user: UserResponse) => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      role: user.role,
      spotId: user.spotId || '',
    });
    setSelectedUserId(user.id);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSave = () => {
    const token = getToken();
    if (!token) return;
    if (isEditing && selectedUserId) {
      dispatch(updateUserThunk({ token, data: { userId: selectedUserId, ...form } }));
    } else {
      dispatch(createUserThunk({ token, data: form }));
    }
    setDialogOpen(false);
  };

  const handleDelete = (userId: number) => {
    const token = getToken();
    if (!token) return;
    dispatch(deleteUserThunk({ token, userId }));
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">{t('users')}</h2>
          <Button onClick={openCreateDialog}>
            <PlusCircle className="w-4 h-4" />
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border shadow">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-xs uppercase text-muted-foreground">
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3">{t('id')}</th>
                <th className="px-6 py-3">{t('firstName')}</th>
                <th className="px-6 py-3">{t('lastName')}</th>
                <th className="px-6 py-3">{t('email')}</th>
                <th className="px-6 py-3">{t('spotId')}</th>
                <th className="px-6 py-3">{t('role')}</th>
                <th className="px-6 py-3">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="px-6 py-3">{user.id}</td>
                  <td className="px-6 py-3">{user.firstName}</td>
                  <td className="px-6 py-3">{user.lastName}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">{user.spotId}</td>
                  <td className="px-6 py-3">{user.role}</td>
                  <td className="p-2 space-x-2">
                    <Button size="sm" onClick={() => openEditDialog(user)}>
                      {t('edit')}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? t('editUser') : t('create')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder={t('firstName')}
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
            />
            <Input
              placeholder={t('lastName')}
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
            />
            <Input
              placeholder={t('email')}
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <Input
              placeholder={t('spotId')}
              value={form.spotId}
              onChange={e => setForm({ ...form, spotId: e.target.value })}
            />
            <Input
              placeholder={t('password')}
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <Select value={form.role} onValueChange={value => setForm({ ...form, role: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('selectRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">{t('admin')}</SelectItem>
                <SelectItem value="Manager">{t('manager')}</SelectItem>
                <SelectItem value="Chef">{t('chef')}</SelectItem>
                <SelectItem value="Owner">{t('owner')}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleSave}>{t('save')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
