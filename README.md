# ⚡ Freelance CRM

A clean, dark-mode CRM dashboard built for freelancers to track clients, projects, budgets, and statuses — in real time.

![Stack](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-square&logo=firebase)
![Stack](https://img.shields.io/badge/Auth-Google-blue?style=flat-square&logo=google)
![Stack](https://img.shields.io/badge/JS-Vanilla%20ES6-yellow?style=flat-square&logo=javascript)
![Stack](https://img.shields.io/badge/Design-Responsive-green?style=flat-square)

---

## Features

- 🔐 Google Sign-In (Firebase Auth) — your data is private to your account
- 📊 Live dashboard stats — total clients, total budget, in-progress, completed
- 🌍 Country picker with flag + currency (REST Countries API)
- 🔍 Search + filter by status (All / In Progress / Done / Pending)
- ⚡ Real-time sync via Firestore `onSnapshot`
- 📱 Fully responsive — sidebar on desktop, bottom nav on mobile
- 🛡️ Firestore security rules — users can only access their own data

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Auth | Firebase Authentication (Google) |
| Database | Cloud Firestore (real-time) |
| Frontend | Vanilla JS (ES6 modules) |
| Styling | Pure CSS (custom design system) |
| Countries | REST Countries API |
| Hosting | Firebase Hosting |

## Getting Started

1. Clone the repo
2. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
3. Enable **Google Auth** and **Firestore**
4. Add your Firebase config to `config.js`
5. Set Firestore rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. Deploy with Firebase Hosting or open `index.html` with a local server

## Project Structure

```
CRM/
├── index.html      # App shell + dashboard layout
├── style.css       # Design system + responsive styles
├── app.js          # All logic — auth, CRUD, real-time, UI
├── firebase.js     # Firebase initialization
└── config.js       # Your Firebase project config
```

## Roadmap

- [ ] Edit client details inline
- [ ] Notes / activity log per client
- [ ] Sort by budget, date, or status
- [ ] Budget chart (by status breakdown)
- [ ] Dark / light mode toggle

---

Built with 🖤 by [Abdelrahman Mohamed](https://github.com/Abdo-mohdev/CRM-Freelance)
Linked In (www.linkedin.com/in/abdelrahman-mdev)
