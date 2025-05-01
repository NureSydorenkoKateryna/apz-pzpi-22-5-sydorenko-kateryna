package culinary.food_flow.data.remote

import culinary.food_flow.data.model.CreateMeasurementCommand
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface MeasurementService {
    @POST("measurements")
    suspend fun registerMeasurement(
        @Body command: CreateMeasurementCommand
    ): Response<Unit>
}
