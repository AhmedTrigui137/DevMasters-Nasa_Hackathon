variable "name" {}
variable "rg_name" {}
variable "location" {}
variable "adls_filesystem_id" {}
variable "sql_admin_user" {}
variable "sql_admin_password" {}
variable "tags" {
  type    = map(string)
  default = {}
}
