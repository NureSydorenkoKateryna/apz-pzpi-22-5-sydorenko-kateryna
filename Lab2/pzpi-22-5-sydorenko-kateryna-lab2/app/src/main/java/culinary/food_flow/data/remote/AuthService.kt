package culinary.food_flow.data.remote

import culinary.food_flow.data.model.LoginRequest
import culinary.food_flow.data.model.LoginResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthService {
    @POST("account/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse
}