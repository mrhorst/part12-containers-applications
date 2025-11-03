Link to the other repository:
https://github.com/mrhorst/full-stack-open-pokedex/

# Bloglist

A simple Bloglist app. The backend is built from scratch with Express. This repo was adapted for Full Stack Open Part 11 and includes a small CI/CD pipeline using GitHub Actions. It’s for learning only, and you'll probably find some mistakes here and there.

## Tech

- Node.js + Express
- MongoDB (Mongoose)
- GitHub Actions (CI/CD)
- Supertest (HTTP tests)

## Scripts

- `dev`: start the server in development with file watching.
- `test`: run the Node.js test runner.
- `start:test`: start the server in test mode (with watching).
- `build:frontend`: build the frontend into `frontend/dist`.
- `build:prod`: clean and reinstall modules, then build the frontend for production.
- `build:ci`: CI build for the frontend (production mode).
- `clear-modules`: remove backend and frontend node_modules.
- `clear-dist`: remove `frontend/dist`.
- `install-fresh-modules`: reinstall backend and frontend dependencies.
- `start:prod`: build for production and start the server.

Note: these scripts are intentionally specific because I was testing different setup and deployment scenarios.

## CI/CD

The pipeline installs deps, runs tests, builds the frontend, and can deploy. It’s intentionally simple to learn the basics.

## Disclaimer

This app has minimal practical use. It exists to practice backend fundamentals and CI/CD.
