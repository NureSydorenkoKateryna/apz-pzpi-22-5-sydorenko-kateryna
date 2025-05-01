package culinary.food_flow.data.remote

import culinary.food_flow.data.model.CulinaryTokenResponse
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

interface CulinaryService {
    @GET("culinarytokens")
    suspend fun getCulinaryToken(
        @Query("productId") productId: String,
        @Query("techCardId") techCardId: String
    ): CulinaryTokenResponse

    @GET("culinarytokens/disable")
    suspend fun disableToken(
        @Query("token") token: String
    ): Response<Unit>
}
