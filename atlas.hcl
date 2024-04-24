variable "host" {
  type = string
  default = "localhost"
}

variable "port" {
  type = string
  default = "5432"
}

variable "username" {
  type = string
  default = "postgres"
}

variable "password" {
  type = string
  default = "example"
}

variable "database" {
  type = string
  default = "test_integration"
}

env "yen" {
  src = "file://db/schema.pg.hcl"
  url = "postgres://${var.username}:${var.password}@${var.host}:${var.port}/${var.database}?search_path=public&sslmode=disable"
  dev = "docker://postgres/15"

  migration {
    dir    = "file://db/migrations"
    format = atlas
  }

  format {
    migrate {
      diff = format("{{ sql . \"  \" }}")
    }
  }
}
