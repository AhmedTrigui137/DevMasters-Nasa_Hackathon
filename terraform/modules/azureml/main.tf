resource "azurerm_machine_learning_workspace" "mlws" {
  name                = var.name
  location            = var.location
  resource_group_name = var.rg_name
  sku_name            = "Basic"
  friendly_name       = var.name
  identity {
    type = "SystemAssigned"
  }
}
