
<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Moaz-ashraf1/Build-a-Full-E-Commerce-RESTful-APIs">
    <img src="https://cdn-icons-png.flaticon.com/512/6213/6213702.png" alt="Logo" width="200" height="200">
  </a>

  <h3 align="center">Node.js E-Commerce API</h3>
</p>

<h4 align="center">Ecommerce API built using NodeJS & Express & MongoDB</h4>

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Deployment](#deployment)
- [Installation](#installation)


## Description

A RESTful API for building a full-featured E-Commerce application. This API provides the backend functionality required for managing products, users, orders, reviews, wishlist, addresses, coupons and more in an E-Commerce system.

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
- hpp
- express-rate-limit
- express-mongo-sanitize
- xss-clean
- Stripe _(for payment processing)_

  
## Deployment

The API is deployed with git into Cyclic. Below are the steps taken:

```
git init
git add -A
git commit -m "Commit message"
```

 ## Installation

You can fork the app or you can git-clone the app into your local machine. Once done that, please install all the dependencies by running

```sh
$ npm install
set your env variables
$ npm run start:dev



