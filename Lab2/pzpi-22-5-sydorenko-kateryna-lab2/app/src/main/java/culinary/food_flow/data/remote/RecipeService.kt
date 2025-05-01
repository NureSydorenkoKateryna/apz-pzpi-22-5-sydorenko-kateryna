package culinary.food_flow.data.remote

import culinary.food_flow.data.model.TechCardsResponse
import retrofit2.http.GET

interface RecipeService {
    @GET("techcards")
    suspend fun getTechCards(): TechCardsResponse
}