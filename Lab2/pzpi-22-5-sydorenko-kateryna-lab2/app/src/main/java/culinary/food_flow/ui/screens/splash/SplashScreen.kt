package culinary.food_flow.ui.screens.splash

import android.app.Application
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import culinary.food_flow.ui.main.viewmodel.SplashViewModel
import culinary.food_flow.ui.main.viewmodel.SplashViewModelFactory

@Composable
fun SplashScreen(
    viewModel: SplashViewModel = viewModel(
        factory = SplashViewModelFactory(LocalContext.current.applicationContext as Application)
    ),
    onLoggedIn: () -> Unit,
    onNotLoggedIn: () -> Unit
) {
    val isLoggedIn = viewModel.isLoggedIn

    LaunchedEffect(Unit) {
        viewModel.checkLoginStatus()
    }

    when (isLoggedIn) {
        true -> onLoggedIn()
        false -> onNotLoggedIn()
        null -> {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        }
    }
}
