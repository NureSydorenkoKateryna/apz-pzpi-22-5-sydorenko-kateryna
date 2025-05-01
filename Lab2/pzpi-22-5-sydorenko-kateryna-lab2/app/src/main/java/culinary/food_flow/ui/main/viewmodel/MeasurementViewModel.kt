package culinary.food_flow.ui.main.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import culinary.food_flow.data.remote.ApiClient
import culinary.food_flow.data.remote.MeasurementService
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.MutableStateFlow
import androidx.lifecycle.viewModelScope
import culinary.food_flow.data.model.CreateMeasurementCommand
import culinary.food_flow.data.remote.CulinaryService
import kotlinx.coroutines.launch
import android.util.Log

class MeasurementViewModel(application: Application) : AndroidViewModel(application) {
    private val service = ApiClient.retrofit.create(CulinaryService::class.java)
    private val measurementService = ApiClient.retrofit.create(MeasurementService::class.java)

    private val _culinaryToken = MutableStateFlow<String?>(null)
    val culinaryToken: StateFlow<String?> = _culinaryToken

    private val _isSubmitting = MutableStateFlow(false)
    val isSubmitting: StateFlow<Boolean> = _isSubmitting

    fun getToken(productId: String, techCardId: String) {
        viewModelScope.launch {
            try {
                val response = service.getCulinaryToken(productId, techCardId)
                _culinaryToken.value = response.token
            } catch (e: Exception) {
                Log.e("MeasurementViewModel", "Token Error", e)
            }
        }
    }

    fun sendMeasurement(ingredientId: Long, value: Double) {
        val token = _culinaryToken.value ?: return
        viewModelScope.launch {
            _isSubmitting.value = true
            try {
                val command = CreateMeasurementCommand(
                    token = token,
                    amount = value
                )
                measurementService.registerMeasurement(command)
            } catch (e: Exception) {
                Log.e("MeasurementViewModel", "Measurement Error", e)
            } finally {
                _isSubmitting.value = false
            }
        }
    }

    fun finishToken(onFinished: () -> Unit) {
        val token = _culinaryToken.value ?: return
        viewModelScope.launch {
            try {
                service.disableToken(token)
                _culinaryToken.value = null
                onFinished()
            } catch (e: Exception) {
                Log.e("MeasurementViewModel", "Disable Token Error", e)
            }
        }
    }
}

class MeasurementViewModelFactory(
    private val application: Application
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(MeasurementViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return MeasurementViewModel(application) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}


