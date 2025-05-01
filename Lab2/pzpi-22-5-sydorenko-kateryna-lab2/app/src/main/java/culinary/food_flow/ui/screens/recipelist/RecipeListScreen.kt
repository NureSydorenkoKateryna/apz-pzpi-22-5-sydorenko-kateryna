import android.app.Application
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import culinary.food_flow.ui.main.viewmodel.RecipeViewModel
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import culinary.food_flow.ui.main.viewmodel.AuthViewModel
import culinary.food_flow.ui.main.viewmodel.RecipeViewModelFactory

@Composable
fun RecipeListScreen(
    recipeViewModel: RecipeViewModel = viewModel(
        factory = RecipeViewModelFactory(
            LocalContext.current.applicationContext as Application
        )
    ),
    onRecipeSelected: () -> Unit
) {
    val techCards by recipeViewModel.techCards.collectAsState()

    LaunchedEffect(Unit) {
        recipeViewModel.fetchTechCards()
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        item {
            Text(
                text = "Available Recipes",
                style = MaterialTheme.typography.headlineMedium,
                modifier = Modifier
                    .padding(bottom = 16.dp)
            )
        }

        items(techCards) { techCard ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
                    .clickable {
                        recipeViewModel.selectRecipe(techCard)
                        onRecipeSelected()
                    },
                elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
            ) {
                Column(
                    modifier = Modifier
                        .padding(16.dp)
                ) {
                    Text(
                        text = techCard.name,
                        style = MaterialTheme.typography.titleLarge
                    )
                }
            }
        }
    }
}

