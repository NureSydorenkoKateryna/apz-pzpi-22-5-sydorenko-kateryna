import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import culinary.food_flow.ui.main.viewmodel.RecipeViewModel

@Composable
fun IngredientSelectionScreen(
    viewModel: RecipeViewModel,
    onIngredientSelected: () -> Unit,
    onBack: () -> Unit
) {
    val selectedRecipe by viewModel.selectedRecipe.collectAsState()

    val ingredients = selectedRecipe?.ingredients.orEmpty()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            "Ingredients for ${selectedRecipe?.name ?: ""}",
            style = MaterialTheme.typography.titleLarge
        )
        Spacer(Modifier.height(8.dp))

        LazyColumn {
            items(ingredients) { ingredient ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 6.dp)
                        .clickable {
                            viewModel.chooseIngredient(ingredient)
                            onIngredientSelected()
                        },
                    elevation = CardDefaults.cardElevation(4.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = ingredient.name,
                            style = MaterialTheme.typography.titleMedium
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Amount: ${ingredient.amount} ${ingredient.unit}",
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { onBack() },
            modifier = Modifier.align(Alignment.CenterHorizontally)
        ) {
            Text("Back")
        }
    }
}


