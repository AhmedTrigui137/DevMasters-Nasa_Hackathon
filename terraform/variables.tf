variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "rg-axi-azure-datalake"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "axi-azure-datalake"
}

variable "webhook_url" {
  description = "Webhook URL for Event Grid subscriptions"
  type        = string
  default     = "https://example.com/webhook"
}
