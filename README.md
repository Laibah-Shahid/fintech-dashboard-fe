# 💳 FinConnect — Frontend (Subscription-Gated Fintech API Dashboard)

**FinConnect** is a subscription-gated fintech API dashboard that allows developers to register, subscribe to a plan, and access a secure dashboard to interact with a suite of mock financial APIs. This repo contains the **frontend** of the application, built with modern web technologies including **React.js**, **Tailwind CSS**, **TypeScript**, and **shadcn/ui**.

---

## 🚀 Tech Stack

- **Library:** React.js
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Language:** TypeScript
- **API Integration:** All features consume backend REST APIs (no mock logic in UI)

---

## 📁 Features (Frontend)

- **🔐 Authentication**
  - Registration (`/register`) with name, email, password
  - Login (`/login`) with email, password

- **💳 Subscription Flow**
  - Pricing page (`/pricing`) gated for users without subscription
  - Subscribe or Cancel plan 
  - Gated access to `/dashboard/*` unless subscription is active

- **📊 Dashboard Pages (Accessible post-subscription)**
  - `/dashboard/balance` – View mock account balance
  - `/dashboard/transfer` – Transfer funds between mock accounts
  - `/dashboard/transactions` – View paginated transaction history
  - `/dashboard/invoice` – Generate and download invoice for a date range

- **🛡️ Role-based Access (RBAC)**
  - Developers access APIs and dashboard
  - Admins access management features via protected routes

---


