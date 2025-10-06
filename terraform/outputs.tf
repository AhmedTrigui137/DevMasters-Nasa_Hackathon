output "resource_group_name" {
  description = "The name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "storage_account_name" {
  description = "The name of the storage account"
  value       = module.axi_storage.storage_account_name
}

output "data_lake_filesystem_name" {
  description = "The name of the Data Lake filesystem"
  value       = module.data_lake.filesystem_name
}

output "api_management_url" {
  description = "The URL of the API Management service"
  value       = module.api_management.gateway_url
}

output "web_app_url" {
  description = "The URL of the web app"
  value       = module.app_services.web_app_url
}

output "api_app_url" {
  description = "The URL of the API app"
  value       = module.app_services.api_app_url
}

output "application_insights_id" {
  description = "The ID of the Application Insights resource"
  value       = azurerm_application_insights.main.id
}

output "key_vault_name" {
  description = "The name of the Key Vault"
  value       = azurerm_key_vault.main.name
}

output "azure_ad_application_id" {
  description = "The Application ID of the Azure AD app"
  value       = module.active_directory.application_id
}

output "virtual_network_name" {
  description = "The name of the virtual network"
  value       = module.network.virtual_network_name
}

output "event_grid_topic_name" {
  description = "The name of the Event Grid topic"
  value       = module.event_grid.topic_name
}