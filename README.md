<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description
A simple social platform backend (like Facebook) built using:
  .NestJS (no ORM)
  .PostgreSQL with raw SQL
  .JWT Authentication
  .Mailer support for registration


## Project Architecture
  src/
├── common/                  # Decorators, interfaces, DTOs, utils
├── modules/
|   ├──database/             # DB connection, raw SQL migrations
│     ├── migrations/           # DB and tables setup services
│     └── sql/                  # init.sql (schema definitions)
│   ├── auth/                # SignUp, SignIn (with auto password mail)
│   ├── users/               # User search, CRUD, filters
│   ├── friends/             # Friend requests, listing, accept/decline
│   ├── mail/                # Mailer with handlebars templates
│   └── token/               # JWT Auth, Roles, Guards
├── crypto/                  # Key generation script + keys
├── test/                    # Jest test setup
├── main.ts
└── app.module.ts


## Features Implemented
  ✅User registration with auto-generated password sent via email
  ✅ Secure sign-in using JWT and bcrypt
  ✅ Friend request system (send, accept, decline, list)
  ✅ Search users by first name, last name, and age
  ✅ Trigger to update updated_at field on user change
  ✅ DTO-based request validation
  ✅ Modular and scalable file structure


## Tech Stack
  .NestJS – Backend framework
  .PostgreSQL – Relational database
  .pg – Native SQL driver
  .JWT (RS256) – Auth with private/public keys
  .Bcrypt – Password hashing
  .Mailer (nodemailer) – Email delivery
  .Class-validator – DTO validation
  .Jest – Testing framework


##  Database Setup
  .Tables: users, friendships
  .Migration: src/database/sql/init.sql
  .Includes:
    .Creates tables
    .Adds trigger for updated_at
    .Adds indexes for first_name, last_name, age

## Mailing
  .Mailer configured with @nestjs-modules/mailer
  .Handlebars templates stored in mail/templates
  .Used in registration to send temporary password
  .Mailer is configured with Mailtrap for local testing. SMTP settings can be replaced with production credentials via .env.  

## CI/CD via GitHub Actions
  .github/workflows/ci.yml
  .Runs on push to master
  .PostgreSQL + Node + Jest tests


##  How to Run
# Install dependencies
```bash
$ npm install
```
# Create .env from .env.example
cp .env.example .env


## For JWT keys public and private we need to use this commands
  .With public key check JWT token
  .with private key create generate JWT token
```bash
$ openssl genrsa -out private.pem 2048
$ openssl rsa -in private.pem -pubout -out public.pem
```

## Compile and run the project
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```