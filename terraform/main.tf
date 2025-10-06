# main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.0"
    }
  }
}

provider "azurerm" {
  features {}
}

provider "azuread" {
  # Azure AD provider configuration
}

# Create resource group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    environment = var.environment
    project     = var.project_name
    deployed-by = "terraform"
  }
}

# Application Insights for monitoring
resource "azurerm_application_insights" "main" {
  name                = "appi-${var.environment}-${var.project_name}"
  location            = var.location
  resource_group_name = azurerm_resource_group.main.name
  application_type    = "web"

  tags = {
    environment = var.environment
    project     = var.project_name
  }
}

# Name Layer Modules

## AXI Storage Module
module "axi_storage" {
  source              = "./modules/axi"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  environment         = var.environment
  project_name        = var.project_name
}

## Azure Data Lake Module
module "data_lake" {
  source                = "./modules/data_lake"
  location              = var.location
  storage_account_name  = module.axi_storage.storage_account_name
  rg_name               = azurerm_resource_group.main.name
}

# Value Layer Modules

## Azure Network Module
module "network" {
  source              = "./modules/network"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  environment         = var.environment
  project_name        = var.project_name
}

## Azure Event Grid Module
module "event_grid" {
  source              = "./modules/event_grid"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  environment         = var.environment
  project_name        = var.project_name
  source_resource_id  = module.axi_storage.storage_account_id
  webhook_url         = var.webhook_url
}

# API Layer Modules

## API Management Module
module "api_management" {
  source              = "./modules/api_management"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  environment         = var.environment
  project_name        = var.project_name
  publisher_name      = "AXI Company"
  publisher_email     = "admin@axi.com"
}

## Azure Active Directory Module
module "active_directory" {
  source       = "./modules/active_directory"
  environment  = var.environment
  project_name = var.project_name
  redirect_uris = [
    "https://app-axi-web-${var.environment}.azurewebsites.net/callback",
    "https://app-axi-api-${var.environment}.azurewebsites.net/callback"
  ]
}

## App Services Module
module "app_services" {
  source                   = "./modules/app_services"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = var.location
  environment              = var.environment
  project_name             = var.project_name
  app_insights_key         = azurerm_application_insights.main.instrumentation_key
  datalake_connection_string = module.axi_storage.primary_connection_string
  storage_account_name     = module.axi_storage.storage_account_name
  storage_account_key      = module.axi_storage.primary_access_key
}

