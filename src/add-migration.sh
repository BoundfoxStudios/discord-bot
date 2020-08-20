#!/usr/bin/env bash

MIGRATION_NAME=$1

dotnet ef migrations add "$MIGRATION_NAME" \
  --startup-project ./BoundfoxStudios.Host/BoundfoxStudios.Host.csproj \
  --project ./BoundfoxStudios.Data/BoundfoxStudios.Data.csproj \
  
