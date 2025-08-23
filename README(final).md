# Chirper — A Scalable Twitter‑Style Clone
#📜 Overview
Chirper is a minimalist social media platform inspired by Twitter/X, built with Node.js, React, and PostgreSQL. While the deployed version runs on a single server, the architecture is designed with 200M+ DAU scale in mind, showcasing production‑grade patterns like caching, async fan‑out, and search indexing.

#🚀 Features
User Authentication — JWT‑based signup/login with bcrypt password hashing.

Post Tweets — Text + optional image uploads.

Follow System — Follow/unfollow users.

Home Timeline — Cached and paginated.

Real‑Time Updates — New tweets pushed via WebSockets.

Search — Full‑text search powered by Meilisearch/Elasticsearch.

Likes & Retweets — Engagement features.

Responsive UI — Built with TailwindCSS.

#🏗 Architecture

```
[React Client] → [API Gateway] → [Node.js Services] → [PostgreSQL]
                                   ↘ [Redis Cache]
                                   ↘ [BullMQ Workers]
                                   ↘ [Search Index]
```

Scale‑Ready Components:

Redis — Timeline caching (timeline:{user_id}).

BullMQ — Simulated Kafka‑style fan‑out for tweet distribution.

Sharding Strategy — Schema designed for horizontal partitioning.

Hybrid Fan‑Out — Large accounts (>50k followers) use fan‑out‑on‑read.

#📊 Scaling Strategy
Challenge	MVP Solution	At Scale (200M DAU)
Timeline generation	Redis cache + async fan‑out	Kafka + Redis Cluster
Database load	Single Postgres instance	Sharded Postgres / Citus
Search	Meilisearch	Elasticsearch cluster
Media storage	Local uploads	S3 + CDN
Real‑time updates	Socket.IO	WebSocket gateway + Pub/Sub
#🧪 Load Testing
Tool: k6 / Artillery

Simulated:

100 reads/day/user

10 writes/day/user

Metrics tracked:

p95 latency

Redis hit ratio

Queue lag

#📦 Tech Stack
Frontend: React, TailwindCSS, React Query Backend: Node.js, Express/Fastify, PostgreSQL, Redis, BullMQ Search: Meilisearch / Elasticsearch Deployment: Vercel (frontend), Render/Railway (backend)

#📈 Future Improvements
Distributed cache with Redis Cluster

Kafka for high‑throughput fan‑out

Multi‑region deployment

Rate limiting & abuse detection

GraphQL API layer

#🖼 Screenshots
(Add GIFs or PNGs of timeline, posting, and real‑time updates here)

#📚 How to Run Locally

```
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

#📄 License
MIT License — free to use and modify.