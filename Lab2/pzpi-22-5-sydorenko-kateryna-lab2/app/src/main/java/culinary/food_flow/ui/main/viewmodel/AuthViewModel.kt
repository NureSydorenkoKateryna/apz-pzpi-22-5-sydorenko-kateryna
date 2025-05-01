package culinary.food_flow.ui.main.viewmodel

import android.util.Log
import androidx.lifecycle.AndroidViewModel
import android.app.Application
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import culinary.food_flow.data.model.LoginRequest
import culinary.food_flow.data.remote.ApiClient
import culinary.food_flow.data.remote.AuthService
import culinary.food_flow.utils.TokenManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class AuthViewModel(application: Application) : AndroidViewModel(application){

    private val authService = ApiClient.retrofit.create(AuthService::class.java)

    private val _loginState = MutableStateFlow<LoginState>(LoginState.Idle)
    val loginState: StateFlow<LoginState> = _loginState

    private val tokenManager = TokenManager(application)

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _loginState.value = LoginState.Loading
            try {
                val response = authService.login(LoginRequest(email, password))
                tokenManager.saveToken(response.token)
                Log.i("AuthViewModel", "Login success: token ${response.token}")
                Log.i("AuthViewModel", "In token mager: token ${tokenManager.token.first()}")

                _loginState.value = LoginState.Success(response.token)
            } catch (e: Exception) {
                Log.e("AuthViewModel", "Login failed", e)
                _loginState.value = LoginState.Error(e.localizedMessage ?: "Unknown error")
            }
        }
    }
}

sealed class LoginState {
    object Idle : LoginState()
    object Loading : LoginState()
    data class Success(val token: String) : LoginState()
    data class Error(val message: String) : LoginState()
}

class AuthViewModelFactory(
    private val application: Application
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(AuthViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return AuthViewModel(application) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
