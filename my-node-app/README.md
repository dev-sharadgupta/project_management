# Node.js + TypeORM + MySQL Starter

This is a boilerplate Node.js project using **TypeScript**, **Express**, **TypeORM**, and **MySQL**.

---

## 🛠 Technologies Used

- Node.js
- Express
- TypeScript
- TypeORM
- MySQL

---

## 🚀 Setup Instructions
Step 1 : Initalize Project
-   npm init -y         ->      To Create the package.json file
-   npx tsc --init      ->      Creates and configures tsconfig.json
-   npm i typescript    ->      Adds TypeScript compiler to your project

Runtime dependencies:
- npm install express typeorm reflect-metadata mysql2
Development dependencies:
- npm install -D typescript ts-node-dev @types/node @types/express

Install a database driver: 
- npm install mysql2

Install the npm package:
- npm install typeorm --save

You need to install reflect-metadata shim:
- npm install reflect-metadata --save

# The folder structure will be like this
MyProject
├── src                   // place of your TypeScript code
│   ├── entity            // place where your entities (database models) are stored
│   │   └── User.ts       // sample entity
│   ├── migration         // place where your migrations are stored
│   ├── data-source.ts    // data source and all connection configuration
│   └── index.ts          // start point of your application
├── .gitignore            // standard gitignore file
├── package.json          // node module dependencies
├── README.md             // simple readme file
└── tsconfig.json         // TypeScript compiler options


# Uncomment this from file (tsconfig.json)
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}

# Install the dovenv file 
- npm install dotenv
      Node.js does not automatically load environment variables from .env files.

# Install moment
  npm install moment
  npm install --save-dev @types/moment

# Install cors (Cross-Origin Resource Sharing) for API Calling
  npm install cors
  npm install --save-dev @types/cors