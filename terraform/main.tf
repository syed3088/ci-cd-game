provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0b6c6ebed2801a5cb"
  instance_type = "t2.micro"
  key_name      = "jenkins-kp"

  vpc_security_group_ids = ["sg-052f7ae062a320b6f"]

  tags = {
    Name = "jenkins-game-server"
  }
}

output "public_ip" {
  value = aws_instance.web.public_ip
}
