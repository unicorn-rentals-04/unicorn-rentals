resource "random_string" "token" {
  length  = 32
  special = false
  upper   = true
}

resource "random_string" "db_user" {
  length  = 20
  special = false
  upper   = true
}

resource "random_string" "db_pass" {
  length  = 32
  special = false
  upper   = true
}

output "auth_token" {
  value = random_string.token.result
}

output "db_user" {
  value = random_string.db_user.result
}

output "db_pass" {
  value = random_string.db_pass.result
}
