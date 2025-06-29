# 🍰 Pastry Shop Automation System

This project will provide you with a complete automation system for your pastry shop.

[![React](https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/get-started/)

## Features

- Docker allows you to build a system with a single command
- Full-fledged fullstack project
- Real business processes are automated

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/-Redux-764ABC?style=flat&logo=redux&logoColor=white)
![RTK Query](https://img.shields.io/badge/-RTK_Query-764ABC?style=flat&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/-React_Router-CA4245?style=flat&logo=react-router&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

### UI Libraries
![Ant Design](https://img.shields.io/badge/-Ant_Design-0170FE?style=flat&logo=ant-design&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-000000?style=flat&logo=json-web-tokens&logoColor=white)
![WebSocket](https://img.shields.io/badge/-WebSocket-010101?style=flat&logo=websocket&logoColor=white)
![Nodemailer](https://img.shields.io/badge/-Nodemailer-009688?style=flat&logo=gmail&logoColor=white)

### Databases & Architecture
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Nginx](https://img.shields.io/badge/-Nginx-009639?style=flat&logo=nginx&logoColor=white)
![REST API](https://img.shields.io/badge/-REST_API-FF6C37?style=flat&logo=api&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white)

## Implemented functions

### Authentication system
- 📧 Registration with email confirmation
- 🔑 JWT authorization
- 👨‍💼 Separation of roles (client/admin)

### Admin panel
- 🧑‍🤝‍🧑 User management (friends/admins)
- 🍪 CRUD for products
- 🎁 Generate QR codes for bonus coffees
- 📊 Order management

### Client panel
- 🛒 Shopping cart with order processing
- 🎫 Discount program "Friend of the pastry-shop"
- 📱 QR codes for bonuses
- ⏱ Order status tracking

## Quick Start with Docker

This project can be set up with a single Docker command. Follow these simple steps to get the Pastry Shop Automation System up and running.

### Prerequisites

Install [Docker Desktop](https://www.docker.com/get-started/). This includes both Docker and Docker Compose

- [Installation guide for Windows/Mac](https://docs.docker.com/desktop/)

- For Linux (Ubuntu/Debian):

    ```bash
    sudo apt-get update && sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
    ```
- Verify installation:

    ```bash
    docker --version && docker compose version
    ```
    
Clone the repository (if you haven't already)

```bash
https://github.com/Thayorns/pastry-shop.git
cd pastry-shop
```

Configure Environment Variables. The project requires `.env*` files in these locations:

- Roor folder (main settings)

- `client/` (frontend variables)

- `server/` (backend variables)

How to set up

- For each folder (root, `client`, `server`) :
    
    - Find the `example.env` file
    - Create a copy named `.env*`:

        ```
        cp example.env .env                              # for root folder
        cp example.env.development .env.development      # for client and server folders
        cp example.env.production .env.production        # for client and server folders
        ```
- Open each `.env*` file in a text editor and fill in the required values if needed (API keys, database credentials, etc.)

- Save the files — they will be automatically ignored by Git

*Note: Never commit `.env*` files to version control!*

---
### Running the project

In development mode:

-  make changes to `/server/mailer.js`, `/server/index.js` as indicated in the comments in these files to get all backend functionality. (*optional*)

- run docker command:

    ```bash
    docker-compose -f docker-compose.dev.yml up --build
    ```

- open `http://localhost:3000` url in browser

In production mode:

- make changes to `/client/nginx.conf`, `/client/certbot.sh`, `/server/mailer.js`, `/server/index.js` as indicated in the comments in these files. (*required*)

- run docker command:

    ```bash
    docker-compose up --build
    ```
---

⭐ **If you liked the project, give it a star!** ⭐