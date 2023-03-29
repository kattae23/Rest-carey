# Backend Server

This repository contains a powerful REST server backend that allows you to upload and compress files, create products with their categories, process credit card payments with Stripe, and log in with password and Google OAuth, all being handled with the MongoDB database.

## Features

- File upload and compression
- Product creation with categories
- Credit card payment processing with Stripe
- Password and Google OAuth login
- MongoDB database management

## Requirements

- Node.js
- MongoDB database
- Stripe account

## Installation

1. Clone this repository
2. Install dependencies using `npm install`
3. Set environment variables for MongoDB and Stripe
4. Start the server using `npm start`

## Usage

Once the server is running, you can use the following endpoints:

- `/api/upload`
  - GET request to retrieve all uploaded files
  - POST request to upload and compress a file
  - PUT request to update a specific file by ID
  - DELETE request to delete a specific file by ID

- `/api/products`
  - GET request to retrieve all products
  - POST request to create a new product
  - PUT request to update a specific product by ID
  - DELETE request to delete a specific product by ID
  - `/:id` GET request to retrieve a specific product by ID
  - `/:id` POST request to retrieve a specific product by ID
  - `/:id` PUT request to retrieve a specific product by ID
  - `/:id` DELETE request to retrieve a specific product by ID

- `/api/users`
  - GET request to retrieve all users
  - POST request to create a new user
  - PUT request to update a specific user by ID
  - DELETE request to delete a specific user by ID
  - `/:id` GET request to retrieve a specific user by ID
  - `/:id` POST request to retrieve a specific user by ID
  - `/:id` PUT request to retrieve a specific user by ID
  - `/:id` DELETE request to retrieve a specific user by ID

- `/api/category`
  - GET request to retrieve all categories
  - POST request to create a new category
  - PUT request to update a specific category by ID
  - DELETE request to delete a specific category by ID
  - `/:id` GET request to retrieve a specific category by ID
  - `/:id` POST request to retrieve a specific category by ID
  - `/:id` PUT request to retrieve a specific category by ID
  - `/:id` DELETE request to retrieve a specific category by ID

- `/api/auth`
  - POST request to log in with email and password
  - POST request to log in with Google OAuth

- `/api/contact`
  - POST request to send a contact form message

- `/api/search`
  - GET request to search for products based on a query string parameter

- `/api/checkout`
  - GET request to retrieve all orders from the database
  - POST request to process a credit card payment
  - `/:id` GET request to retrieve a specific order by ID
  - `/:id` POST request to retrieve a specific order by ID
  - `/:id` PUT request to retrieve a specific order by ID
  - `/:id` DELETE request to retrieve a specific order by ID

## Credits

This project was created by Kattae123 and is licensed under the MIT License.
