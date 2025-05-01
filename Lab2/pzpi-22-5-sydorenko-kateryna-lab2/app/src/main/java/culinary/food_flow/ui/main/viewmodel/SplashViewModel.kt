package culinary.food_flow.ui.main.viewmodel

import android.app.Application
import android.util.Log
import androidx.compose.runtime.*
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import culinary.food_flow.utils.TokenManager
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

// todo: deal with cases if the token was expired
class SplashViewModel(application: Application) : AndroidViewModel(application) {
    private val tokenManager = TokenManager(application)

    var isLoggedIn by mutableStateOf<Boolean?>(null)
        private set

    fun checkLoginStatus() {
        viewModelScope.launch {
            val token = tokenManager.token.first()
            isLoggedIn = !token.isNullOrEmpty()
        }
    }
}

class SplashViewModelFactory( private val application: Application): ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(SplashViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return SplashViewModel(application) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}

