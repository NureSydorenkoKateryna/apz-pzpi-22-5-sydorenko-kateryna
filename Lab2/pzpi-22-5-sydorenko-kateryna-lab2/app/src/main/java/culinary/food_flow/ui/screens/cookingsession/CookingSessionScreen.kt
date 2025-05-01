import android.app.Application
import androidx.compose.runtime.Composable
import culinary.food_flow.ui.main.viewmodel.RecipeViewModel
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import culinary.food_flow.ui.main.viewmodel.MeasurementViewModel
import culinary.food_flow.ui.main.viewmodel.MeasurementViewModelFactory
import androidx.compose.material3.OutlinedTextField
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.material3.ButtonDefaults


@Composable
fun CookingSessionScreen(
    recipeViewModel: RecipeViewModel,
    measurementViewModel: MeasurementViewModel = viewModel(
        factory = MeasurementViewModelFactory(LocalContext.current.applicationContext as Application)
    ),
    onBack: () -> Unit,
    onComplete: () -> Unit
) {
    val selectedRecipe by recipeViewModel.selectedRecipe.collectAsState()
    val selectedIngredient by recipeViewModel.selectedIngredient.collectAsState()

    val measurementToken by measurementViewModel.culinaryToken.collectAsState()
    val isSubmitting by measurementViewModel.isSubmitting.collectAsState()
    val context = LocalContext.current

    var inputValue by remember { mutableStateOf("") }

    Column(modifier = Modifier
        .fillMaxSize()
        .padding(16.dp)) {

        Text(
            text = "Manual Measurement",
            style = MaterialTheme.typography.titleLarge
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text("Recipe: ${selectedRecipe?.name ?: "N/A"}")
        Text("Ingredient: ${selectedIngredient?.name ?: "N/A"}")

        Spacer(modifier = Modifier.height(16.dp))

        if (measurementToken == null) {
            Button(
                onClick = {
                    selectedRecipe?.let { recipe ->
                        selectedIngredient?.let { ingredient ->
                            measurementViewModel.getToken(
                                productId = ingredient.productId.toString(),
                                techCardId = recipe.id.toString()
                            )
                        }
                    }
                }
            ) {
                Text("Start Manual Measurement")
            }
        } else {
            OutlinedTextField(
                value = inputValue,
                onValueChange = { inputValue = it },
                label = { Text("Enter measured value") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(8.dp))

            Button(
                onClick = {
                    measurementViewModel.sendMeasurement(
                        ingredientId = selectedIngredient?.id ?: 0,
                        value = inputValue.toDoubleOrNull() ?: 0.0
                    )
                },
                enabled = !isSubmitting
            ) {
                Text(if (isSubmitting) "Submitting..." else "Submit Measurement")
            }

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = {
                    measurementViewModel.finishToken {
                        onComplete()
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color.Red),
                modifier = Modifier.align(Alignment.CenterHorizontally)
            ) {
                Text("Finish")
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
