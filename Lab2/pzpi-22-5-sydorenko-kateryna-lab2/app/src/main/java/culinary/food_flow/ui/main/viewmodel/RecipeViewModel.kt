package culinary.food_flow.ui.main.viewmodel

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import culinary.food_flow.data.model.IngredientDto
import culinary.food_flow.data.model.TechCardDto
import culinary.food_flow.data.remote.ApiClient
import culinary.food_flow.data.remote.RecipeService
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class RecipeViewModel(application: Application) : AndroidViewModel(application) {

    private val _selectedIngredient = MutableStateFlow<IngredientDto?>(null)
    val selectedIngredient: StateFlow<IngredientDto?> = _selectedIngredient

    private val recipeService = ApiClient.retrofit.create(RecipeService::class.java)

    private val _techCards = MutableStateFlow<List<TechCardDto>>(emptyList())
    val techCards: StateFlow<List<TechCardDto>> = _techCards

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage

    private val _selectedRecipe = MutableStateFlow<TechCardDto?>(null)
    val selectedRecipe: StateFlow<TechCardDto?> = _selectedRecipe

    fun selectRecipe(recipe: TechCardDto) {
        _selectedRecipe.value = recipe
    }

    fun fetchTechCards() {
        viewModelScope.launch {
            try {
                val response = recipeService.getTechCards()
                _techCards.value = response.techCards
            } catch (e: Exception) {
                _errorMessage.value = e.localizedMessage ?: "Unknown error"
            }
        }
    }

    fun chooseIngredient(ingredient: IngredientDto) {
        Log.i(ingredient.toString(), "hell");
        _selectedIngredient.value = ingredient
    }
}

class RecipeViewModelFactory( private val application: Application): ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(RecipeViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return RecipeViewModel(application) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
