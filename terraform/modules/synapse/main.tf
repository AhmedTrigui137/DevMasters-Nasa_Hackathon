resource "azurerm_synapse_workspace" "syn" {
  name                                 = var.name
  resource_group_name                  = var.rg_name
  location                             = var.location
  storage_data_lake_gen2_filesystem_id = var.adls_filesystem_id
  sql_administrator_login              = var.sql_admin_user
  sql_administrator_login_password     = var.sql_admin_password
  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_synapse_sql_pool" "pool" {
  name                   = "${var.name}-pool"
  synapse_workspace_id   = azurerm_synapse_workspace.syn.id
  sku_name               = "DW140c"  # change for production
  storage_account_type   = "GRS"     # or "LRS", update as needed
  create_mode            = "Default"
  tags                   = var.tags
}
