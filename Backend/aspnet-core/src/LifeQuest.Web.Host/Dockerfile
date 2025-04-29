FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/LifeQuest.Web.Host/LifeQuest.Web.Host.csproj", "src/LifeQuest.Web.Host/"]
COPY ["src/LifeQuest.Web.Core/LifeQuest.Web.Core.csproj", "src/LifeQuest.Web.Core/"]
COPY ["src/LifeQuest.Application/LifeQuest.Application.csproj", "src/LifeQuest.Application/"]
COPY ["src/LifeQuest.Core/LifeQuest.Core.csproj", "src/LifeQuest.Core/"]
COPY ["src/LifeQuest.EntityFrameworkCore/LifeQuest.EntityFrameworkCore.csproj", "src/LifeQuest.EntityFrameworkCore/"]
WORKDIR "/src/src/LifeQuest.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/LifeQuest.Web.Host", "src/LifeQuest.Web.Host"]
COPY ["src/LifeQuest.Web.Core", "src/LifeQuest.Web.Core"]
COPY ["src/LifeQuest.Application", "src/LifeQuest.Application"]
COPY ["src/LifeQuest.Core", "src/LifeQuest.Core"]
COPY ["src/LifeQuest.EntityFrameworkCore", "src/LifeQuest.EntityFrameworkCore"]
WORKDIR "/src/src/LifeQuest.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "LifeQuest.Web.Host.dll"]
