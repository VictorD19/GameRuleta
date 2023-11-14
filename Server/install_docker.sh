#!/bin/bash

# Actualizar repositorios
sudo apt-get update

# Instalar dependencias para Docker
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common

# Agregar clave GPG de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Agregar repositorio de Docker
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Actualizar repositorios
sudo apt-get update

# Instalar Docker
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Agregar el usuario actual al grupo "docker"
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Asignar permisos de ejecución a Docker Compose
sudo chmod +x /usr/local/bin/docker-compose

# Imprimir versión de Docker y Docker Compose
docker --version
docker-compose --version
