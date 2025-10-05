resource "azurerm_api_management" "apim" {
  name                = var.name
  location            = var.location
  resource_group_name = var.rg_name
  publisher_name      = var.publisher_name
  publisher_email     = var.publisher_email
  sku {
    name     = "Developer"
    capacity = 1
  }
}

# Cosmos DB or Functions can be integrated later.
