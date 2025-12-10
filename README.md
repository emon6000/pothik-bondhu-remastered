# Pothik-bondhu (পথিক-বন্ধু) 🇧🇩

> **The Intelligent, Bilingual Travel Partner for Bangladesh**

**Pothik-bondhu** is a modern, single-page React application designed to revolutionize domestic tourism in Bangladesh. It connects travelers with local guides, provides intelligent route planning, and offers real-time assistance in both **Bangla** and **English**.

![Project Banner](https://via.placeholder.com/1200x600/4f46e5/ffffff?text=Pothik-bondhu+Standalone)

## ✨ Features (Standalone Version)

### 💾 LocalStorage Data
- **No Database Required**: All data (users, bookings) is simulated and stored in your browser's LocalStorage.
- **Persistent Sessions**: Login states remain active even after refreshing.

### 🇧🇩 🇺🇸 Dual Language Support
- **One-Click Toggle**: Instantly switch between Bangla and English.
- **Localized Content**: All UI elements, district details, and ChatBot responses are fully translated.

---

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
To start the development server:
```bash
npm run dev
```
*The app will be available at http://localhost:5173*

### 3. Build for Deployment
To create a production build:
```bash
npm run build
```
Then preview the build:
```bash
npm run preview
```

---

## 🗺️ Core Functionality

### 1. Intelligent Trip Planning
- **Visual Route Planner**: Interactive map showing routes between any of the 64 districts.
- **Timeline View**: Step-by-step breakdown of the journey including "Passing By" districts.

### 2. Guide Booking System
- **Verified Guides**: Database of local guides for every district.
- **Booking Flow**: Travelers can book guides to reveal contact info (Phone/Email).

### 3. District Directory
- **Deep Search**: Fuzzy search enabled (finds "Cox's Bazar" even if typed "Cox Bazar").

---

**Current Version:** 4.1.0 (Standalone)
**License:** MIT
**Developer:** Abdullah Al Mahmud Emon