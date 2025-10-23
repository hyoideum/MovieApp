# Koristimo službeni .NET SDK image za build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Kopiramo csproj i restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Kopiramo ostatak koda i buildamo
COPY . ./
RUN dotnet publish -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

# Port koji aplikacija koristi
EXPOSE 5000

# Pokreni aplikaciju
ENTRYPOINT ["dotnet", "MovieApp.dll"]
