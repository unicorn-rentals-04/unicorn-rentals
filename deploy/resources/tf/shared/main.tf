resource "random_string" "token" {
  length  = 32
  special = false
  upper   = true
}

output "auth_token" {
  value = random_string.token.result
}
