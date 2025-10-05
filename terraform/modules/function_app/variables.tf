variable "name" {}
variable "storage_account_name" {}
variable "rg_name" {}
variable "location" {}
variable "app_settings" {
  type    = map(string)
  default = {}
}
variable "package_url" {
  default = ""
}
