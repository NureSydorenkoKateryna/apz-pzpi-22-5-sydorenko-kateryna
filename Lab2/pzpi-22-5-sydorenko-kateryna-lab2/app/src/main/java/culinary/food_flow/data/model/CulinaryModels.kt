package culinary.food_flow.data.model

data class CulinaryTokenResponse(
    val token: String
)

data class CreateMeasurementCommand(
    val token: String,
    val amount: Double
)