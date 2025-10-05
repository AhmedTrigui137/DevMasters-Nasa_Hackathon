resource "azurerm_storage_account" "func_sa" {
  name                     = var.storage_account_name
  resource_group_name      = var.rg_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_app_service_plan" "plan" {
  name                = "${var.name}-plan"
  location            = var.location
  resource_group_name = var.rg_name
  kind                = "FunctionApp"
  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_function_app" "func" {
  name                       = var.name
  resource_group_name        = var.rg_name
  location                   = var.location
  app_service_plan_id        = azurerm_app_service_plan.plan.id
  storage_account_name       = azurerm_storage_account.func_sa.name
  storage_account_access_key = azurerm_storage_account.func_sa.primary_access_key
  os_type                    = "linux"
  version                    = "~4"
  identity {
    type = "SystemAssigned"
  }
  site_config {
  }

  app_settings = merge(
    {
      FUNCTIONS_WORKER_RUNTIME = "dotnet"
      WEBSITE_RUN_FROM_PACKAGE = var.package_url != "" ? var.package_url : ""
    },
    var.app_settings
  )
}
