# Build-a-Full-E-Commerce-RESTful-APIs

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Description

A RESTful API for building a full-featured E-Commerce application. This API provides the backend functionality required for managing products, users, orders, reviews, wishlist, address, coupons and more in an E-Commerce system.

## Features

- User authentication and authorization.
- Categories management (create, read, update, delete).
- Subcategories management (create, read, update, delete).
- Brands management (create, read, update, delete).
- Reviews management (create, read, update, delete).
- Product management (create, read, update, delete).
- Wishlist management (add product, delete product, read).
- Coupons management (create, read, update, delete).
- User management (register, login, profile).
- Order processing (create, view, update) with cash or card.
- Cart functionality.
- Payment processing integration (Stripe).

  ## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- sharp
- multer
- bcrypt
- Slugify
- Express-Async-Handler
- nodemailer
- Cors
- compression
- Stripe _(for payment processing)_

### Installation

Before you begin, ensure you have met the following requirements:
- [Node.js](https://nodejs.org/) installed
- [npm](https://www.npmjs.com/) (Node Package Manager) installed

```sh
#Clone the Repository
git clone https://github.com/Moaz-ashraf1/Build-a-Full-E-Commerce-RESTful-APIs.git

#Navigate to the project directory
cd Build-a-Full-E-Commerce-RESTful-APIs

#Install Dependencies
npm install

#Environment Configuration
#1. Create a `.env` file in the root directory of the project.
#2. Define the necessary environment variables in the `.env` file. For example:
#PORT=8000
#DATABASE_URI=mongodb://localhost/mydatabase
#SECRET_KEY=mysecretkey
#STRIPE_SECRET=mystripesecret
# 3. Save the `.env` file.

# Start the Application
npm start

