# Introduction
A basic demo how to work with Guard and Passport Strategy for AuthN and AuthZ with custom decorator.

## Prerequisite
- Postgres
- Node 16+

## Setup
1. Install dependencies
```sh
yarn install
```

2. Setup environment variables
```sh
## Copy environment file
cp .env.example .env

## Update DATABASE_URL in .env
## Mostly default postgres installation does not come with password
# DATABASE_URL=postgres://{{YOUR_USERNAME}}:@127.0.0.1:5432/guard?schema=public

## Generate OpenSSL private/public keypair
openssl genrsa -out rsa.private 2048
openssl rsa -in rsa.private -out rsa.public -pubout -outform PEM

## Update .env, for AUTH_PRIVATE_KEY:
cat rsa.private | base64
# For AUTH_PUBLIC_KEY:
cat rsa.public | base64
```

3. Bring up the database
```sh
npx prisma db push
```

4. Start the server
```sh
yarn dev
```

## Usage
1. Register
Default role for standard user:
```sh
curl --location 'http://localhost:3000/auth/register'
```

MANAGER role:
```sh
curl --location 'http://localhost:3000/auth/register?role=MANAGER'
```

ADMINISTRATOR role:
```sh
curl --location 'http://localhost:3000/auth/register?role=ADMINISTRATOR'
```

2. Endpoint test for public access (unauthenticated):
```sh
curl --location 'http://localhost:3000'
```

3. Endpoint test for user (authenticated):
```sh
curl --location 'http://localhost:3000/user' \
--header 'Authorization: Bearer {{YOU TOKEN}}'
```

4. Endpoint test for manager (authenticated and require user role is MANAGER):
```sh
curl --location 'http://localhost:3000/manager' \
--header 'Authorization: Bearer {{YOU TOKEN}}'
```

5. Endpoint test for administrator (authenticated and require user role is ADMINISTRATOR):
```sh
curl --location 'http://localhost:3000/admin' \
--header 'Authorization: Bearer {{YOU TOKEN}}'
```

6. Endpoint test for both role (authenticated and require user role is ADMINISTRATOR or MANAGER):
```sh
curl --location 'http://localhost:3000/mix' \
--header 'Authorization: Bearer {{YOU TOKEN}}'
```