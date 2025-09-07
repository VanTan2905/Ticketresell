# Run the scaffold command
dotnet ef dbcontext scaffold Name=SQLServer Microsoft.EntityFrameworkCore.SqlServer `
    -o ../TicketResell.Repositories/Core/Entities `
    --context-dir ../TicketResell.Repositories/Core/Context `
    --context TicketResellManagementContext `
    --force

# Define namespaces
$oldContextNamespace = "TicketResellManagementContextNamespace.Context" # Default scaffold namespace for context
$oldEntitiesNamespace = "TicketResellManagementContextNamespace.Entities" # Default scaffold namespace for entities
$newNamespace = "Repositories.Core" # Desired common namespace

# Replace the namespace in DbContext file and add 'using Repositories.Core.Entities;' if not present
$contextFilePath = "../TicketResell.Repositories/Core/Context/TicketResellManagementContext.cs"
(Get-Content $contextFilePath) -replace $oldContextNamespace, "$newNamespace.Context" `
    | ForEach-Object {
        if ($_ -notmatch "using Repositories.Core.Entities;") {
            "using Repositories.Core.Entities;" + [Environment]::NewLine + $_
        }
        else { $_ }
    } | Set-Content $contextFilePath

# Replace namespace in each entity file
Get-ChildItem -Path ../TicketResell.Repositories/Core/Entities -Filter *.cs -Recurse | ForEach-Object {
    (Get-Content $_.FullName) -replace $oldEntitiesNamespace, "$newNamespace.Entities" | Set-Content $_.FullName
}
