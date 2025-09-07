# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "TicketResell.Api/TicketResell.Api.csproj"
RUN dotnet restore "TicketResell.Repositories/TicketResell.Repositories.csproj"
RUN dotnet restore "TicketResell.Services/TicketResell.Services.csproj"
RUN dotnet build "TicketResell.Api/TicketResell.Api.csproj" -c Release -o /app/publish

# Publish stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Install sqlcmd for health check
RUN apt-get update && \
    apt-get install -y curl apt-transport-https gnupg && \
    curl -sSL https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl -sSL https://packages.microsoft.com/config/ubuntu/20.04/prod.list -o /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 mssql-tools18 && \
    echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' >> ~/.bashrc && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV PATH="$PATH:/opt/mssql-tools18/bin"

COPY --from=build /app/publish .
COPY TicketResell.Repositories/Database/SampleData.sql ./Database/SampleData.sql

ENTRYPOINT [ "dotnet", "TicketResell.Api.dll" ]
