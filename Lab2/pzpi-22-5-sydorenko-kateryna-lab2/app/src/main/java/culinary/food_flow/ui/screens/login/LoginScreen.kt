import android.app.Application
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import culinary.food_flow.ui.main.viewmodel.AuthViewModel
import culinary.food_flow.ui.main.viewmodel.AuthViewModelFactory
import culinary.food_flow.ui.main.viewmodel.LoginState
import android.widget.Toast

@Composable
fun LoginScreen(
    viewModel: AuthViewModel = viewModel(
        factory = AuthViewModelFactory(
            LocalContext.current.applicationContext as Application
        )
    ),
    onLoginSuccess: () -> Unit
) {
    val loginState by viewModel.loginState.collectAsState()
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {
        TextField(
            value = username,
            onValueChange = { username = it },
            label = { Text("Username") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        TextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                viewModel.login(username, password)
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Login")
        }
    }

    when (loginState) {
        is LoginState.Success -> {
            val token = (loginState as LoginState.Success).token
            // You can save token here if needed
            onLoginSuccess()
        }
        is LoginState.Error -> {
            val errorMessage = (loginState as LoginState.Error).message
            Toast.makeText(LocalContext.current, errorMessage, Toast.LENGTH_SHORT).show()
        }
        LoginState.Loading -> {
            // You can show a loading spinner here

            //CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
        }
        LoginState.Idle -> {
            // Nothing to do
        }
    }
}

@Preview(showBackground = true, showSystemUi = true)
@Composable
fun LoginScreenPreview() {
    LoginScreen() {}
}

