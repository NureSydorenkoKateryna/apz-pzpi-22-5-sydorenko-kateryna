FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
ARG BUILD_CONFIGURATION=Release

RUN mkdir -p /src

WORKDIR /src

COPY src/Bootstrapper ./Bootstrapper
COPY src/Common ./Common
COPY src/Modules ./Modules

RUN dotnet restore "./Bootstrapper/FoodFlow.Bootstrapper/FoodFlow.Bootstrapper.csproj"
COPY . .

ARG ASPNETCORE_ENVIRONMENT
ARG ConnectionStrings__DefaultConnection
ARG JwtSettings__Key

ENV ASPNETCORE_ENVIRONMENT $ASPNETCORE_ENVIRONMENT
ENV ConnectionStrings__DefaultConnection $ConnectionStrings__DefaultConnection
ENV JwtSettings__Key $JwtSettings__Key

WORKDIR "/src/Bootstrapper/FoodFlow.Bootstrapper"
RUN dotnet build "./FoodFlow.Bootstrapper.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./FoodFlow.Bootstrapper.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

#ENTRYPOINT ["dotnet", "FoodFlow.Bootstrapper.dll"]
CMD dotnet FoodFlow.Bootstrapper.dll
