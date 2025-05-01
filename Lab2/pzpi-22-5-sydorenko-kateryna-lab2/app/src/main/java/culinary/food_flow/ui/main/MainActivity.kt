package culinary.food_flow.ui.main

import ConfirmationScreen
import CookingSessionScreen
import IngredientSelectionScreen
import LoginScreen
import RecipeListScreen
import android.app.Application
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import culinary.food_flow.data.remote.ApiClient
import culinary.food_flow.ui.main.viewmodel.RecipeViewModel
import culinary.food_flow.ui.main.viewmodel.RecipeViewModelFactory
import culinary.food_flow.ui.screens.splash.SplashScreen
import culinary.food_flow.ui.theme.FoodflowTheme
import culinary.food_flow.utils.TokenManager

@Composable
fun MainScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current.applicationContext as Application

    val recipeViewModel: RecipeViewModel = viewModel(
        factory = RecipeViewModelFactory(context)
    )

    var screenStack by remember { mutableStateOf(listOf("splash")) }
    val currentScreen = screenStack.last()

    fun navigateTo(screen: String) {
        screenStack = screenStack + screen
    }

    fun navigateBack() {
        if (screenStack.size > 1) {
            screenStack = screenStack.dropLast(1)
        }
    }

    when (currentScreen) {
        "splash" -> SplashScreen(
            onLoggedIn = { screenStack = listOf("recipes") },
            onNotLoggedIn = { screenStack = listOf("login") }
        )
        "login" -> LoginScreen() { navigateTo("recipes") }
        "recipes" -> RecipeListScreen(recipeViewModel) { navigateTo("ingredients") }
        "ingredients" -> IngredientSelectionScreen(
            recipeViewModel,
            onBack = { navigateBack() },
            onIngredientSelected = { navigateTo("cook") }
        )
        "cook" -> CookingSessionScreen(
            recipeViewModel,
            onBack = { navigateBack() },
            onComplete = { navigateTo("confirm") }
        )
        "confirm" -> ConfirmationScreen { navigateTo("recipes") } // todo: return back to the current ingredients list
        else -> Text("Unknown screen")
    }
}


class MainActivity : ComponentActivity() {
    // private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val tokenManger = TokenManager(applicationContext);
        ApiClient.init(tokenManger);

        enableEdgeToEdge()
        setContent {
            FoodflowTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { paddingValues ->
                    MainScreen(
                        modifier = Modifier.padding(paddingValues)
                            .padding(2.dp, 10.dp)
                    )
                }
            }
        }
    }
}


