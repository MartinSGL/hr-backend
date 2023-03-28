#-----------------------------------------------------------------------------------------------------------------
# create an image with only dependecies
# and keep in cache those dependecies
FROM node:18-alpine3.15 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the app with cache dependencies
FROM node:18-alpine3.15 AS builder
WORKDIR /app
# copy the dependencies from deps to builder
COPY --from=deps /app/node_modules ./node_modules
# copy all files files from root 
COPY . .
RUN yarn build


# Production image, copy all the files and run
FROM node:18-alpine3.15 AS runner
# Set working directory
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
#install dependencies
RUN yarn install --prod
#copy build from builder
COPY --from=builder /app/dist ./dist
#run build
CMD [ "node","dist/main" ]