terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}


variable "regions" {
  default = "eu-central-1,ap-northeast-3,ap-south-1"
}

locals {
  regions = split(",", var.regions)
}

provider "aws" {
  alias  = "aws1"
  region = local.regions[0]
}

provider "aws" {
  alias  = "aws2"
  region = local.regions[1]
}

provider "aws" {
  alias  = "aws3"
  region = local.regions[2]
}

module "vpc1" {
  source = "./modules/vpc"
  name   = "vpc1"
  providers = {
    aws = aws.aws1
  }
}

module "vpc2" {
  source = "./modules/vpc"
  name   = "vpc2"
  providers = {
    aws = aws.aws2
  }
}

module "vpc3" {
  source = "./modules/vpc"
  name   = "vpc3"
  providers = {
    aws = aws.aws3
  }
}

output "vpc1" {
  value = {
    vpc_id  = module.vpc1.vpc_id
    subnet1 = module.vpc1.subnet_id1
    subnet2 = module.vpc1.subnet_id2
    region  = module.vpc1.region
  }
}
output "vpc2" {
  value = {
    vpc_id  = module.vpc2.vpc_id
    subnet1 = module.vpc2.subnet_id1
    subnet2 = module.vpc2.subnet_id2
    region  = module.vpc2.region
  }
}
output "vpc3" {
  value = {
    vpc_id  = module.vpc3.vpc_id
    subnet1 = module.vpc3.subnet_id1
    subnet2 = module.vpc3.subnet_id2
    region  = module.vpc3.region
  }
}
