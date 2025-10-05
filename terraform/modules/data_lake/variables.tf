variable "storage_account_name" {}
variable "rg_name" {}
variable "location" {}
variable "tags" {
  type    = map(string)
  default = {}
}