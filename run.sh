#!/bin/sh
exec docker run -it --rm -v "/app/node_modules" -v "$(pwd):/app" -p 3000:3000 "$(docker build -f Dockerfile.dev -q .)" pnpm run "$*"
