resource "azurerm_eventhub_namespace" "eh_ns" {
  name                = var.namespace_name
  location            = var.location
  resource_group_name = var.rg_name
  sku                 = "Standard"
  capacity            = 1
}

resource "azurerm_eventhub" "eh" {
  name                = var.eventhub_name
  namespace_name      = azurerm_eventhub_namespace.eh_ns.name
  resource_group_name = var.rg_name
  partition_count     = 4
  message_retention   = 1
}

resource "azurerm_eventhub_authorization_rule" "send_rule" {
  name                = "send"
  namespace_name      = azurerm_eventhub_namespace.eh_ns.name
  eventhub_name       = azurerm_eventhub.eh.name
  resource_group_name = var.rg_name
  listen              = false
  send                = true
  manage              = false
}
