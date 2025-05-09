 interface CreateUserRequest {
    spotId?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }
  
   interface UpdateUserRequest {
    userId: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: string;
  }
  
   interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    spotId?: string;
  }
  
   interface UsersResponse {
    users: UserResponse[];
  }
  