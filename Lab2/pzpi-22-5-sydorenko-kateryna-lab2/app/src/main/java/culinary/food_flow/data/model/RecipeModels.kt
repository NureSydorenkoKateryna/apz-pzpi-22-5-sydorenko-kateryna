package culinary.food_flow.data.model

data class IngredientDto(
    val id: Long,
    val productId: Long,
    val name: String,
    val unit: String,
    val amount: Double
)


data class TechCardDto(
    val id: Long,
    val name: String,
    val description: String,
    val ingredients: List<IngredientDto>
)


data class TechCardsResponse(
    val techCards: List<TechCardDto>
)
