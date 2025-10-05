variable "name" {}
variable "rg_name" {}
variable "location" {}
variable "app_settings" {
  type    = map(string)
  default = {}
}
