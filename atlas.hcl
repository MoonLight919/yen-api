variable "host" {
  type = string
  default = "ec2-34-252-169-131.eu-west-1.compute.amazonaws.com"
}

variable "port" {
  type = string
  default = "5432"
}

variable "username" {
  type = string
  default = "xojvcsudusntsz"
}

variable "password" {
  type = string
  default = "02cc1d91d5991b24f54dd83dbc0e4727ca84223efa9b72f329462faf7d889beb"
}

variable "database" {
  type = string
  default = "db8jbqv054801s"
}

env "yen" {
  src = "file://db/schema.pg.hcl"
  url = "postgres://${var.username}:${var.password}@${var.host}:${var.port}/${var.database}?search_path=public"
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
