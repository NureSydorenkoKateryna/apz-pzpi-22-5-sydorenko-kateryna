import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { RootState } from '../store';
import { createUser, deleteUser, getUsers, updateUser } from './api';

interface UsersState {
  users: UserResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchUsers = createAsyncThunk<UserResponse[], string>(
  'users/fetchUsers',
  async token => {
    const response = await getUsers(token);
    return response.users;
  }
);

export const createUserThunk = createAsyncThunk<
  UserResponse,
  { token: string; data: CreateUserRequest }
>('users/createUser', async ({ token, data }) => {
  const created = await createUser(token, data);
  return { ...data, id: created };
});

export const updateUserThunk = createAsyncThunk<
  UpdateUserRequest,
  { token: string; data: UpdateUserRequest }
>('users/updateUser', async ({ token, data }) => {
  updateUser(token, data);
  return data;
});

export const deleteUserThunk = createAsyncThunk<number, { token: string; userId: number }>(
  'users/deleteUser',
  async ({ token, userId }) => {
    deleteUser(token, userId);
    return userId;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UserResponse[]>) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createUserThunk.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.users.push(action.payload);
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        toast.error('Failed to create user', {
          description: action.error.message,
        });
      })

      .addCase(updateUserThunk.fulfilled, (state, action: PayloadAction<UpdateUserRequest>) => {
        const index = state.users.findIndex(u => u.id === action.payload.userId);
        if (index > -1) {
          state.users[index] = {
            ...state.users[index],
            ...action.payload,
          };
        }
      })
      .addCase(deleteUserThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export const selectUsers = (state: RootState) => state.users.users;

export default usersSlice;
