resource "azurerm_data_factory" "df" {
  name                = var.name
  location            = var.location
  resource_group_name = var.rg_name
  identity {
    type = "SystemAssigned"
  }
}
