FROM node:20-slim

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

EXPOSE 5049
CMD ["npm", "run", "start", "--", "-p", "5049"]
