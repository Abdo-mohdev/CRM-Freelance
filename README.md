<div align="center">


  <h1>⚡ Freelance CRM</h1>

  <p>A real-time, dark-mode CRM dashboard built for freelancers to track clients, projects, budgets, and statuses — all in one place.</p>

  [![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_App-brightgreen?style=for-the-badge)](https://crm-freelance-e83e9.web.app)
  [![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![CSS](https://img.shields.io/badge/CSS3-Custom_Design_System-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 Google Auth | Sign in with Google — your data is 100% private to your account |
| 📊 Live Stats | Real-time total clients, budget, in-progress & completed counts |
| 🌍 Country Picker | Auto-complete with flag + local currency via REST Countries API |
| 🔍 Search & Filter | Instant search + filter by status (All / In Progress / Done / Pending) |
| ⚡ Real-time Sync | Firestore `onSnapshot` — changes appear instantly, no refresh needed |
| ↓ Export CSV | Download all your clients as a `.csv` file, opens in Excel / Sheets |
| 📱 Responsive | Sidebar on desktop, bottom navigation on mobile |
| 🛡️ Secure | Firestore security rules — no user can access another user's data |

---

## 🛠️ Tech Stack

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

| Layer | Technology |
|-------|-----------|
| Auth | Firebase Authentication (Google Sign-In) |
| Database | Cloud Firestore (real-time listener) |
| Frontend | Vanilla JS (ES6 modules, no frameworks) |
| Styling | Pure CSS (custom design tokens, dark mode) |
| Countries | REST Countries API |
| Hosting | Firebase Hosting |

---

## 🚀 Getting Started

### Prerequisites
- A [Firebase](https://firebase.google.com) account (free tier is enough)
- A local server (VS Code Live Server, or any HTTP server)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Abdo-mohdev/CRM-Freelance.git
   cd CRM-Freelance
   ```

2. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com)

3. **Enable Google Auth**
   - Firebase Console → Authentication → Sign-in method → Google → Enable

4. **Enable Firestore**
   - Firebase Console → Firestore Database → Create database → Start in production mode

5. **Set Firestore security rules**
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

6. **Add your Firebase config**

   Create a `config.js` file in the root:
   ```js
   export const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-app.firebaseapp.com",
     projectId: "your-app-id",
     storageBucket: "your-app.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   }
   ```

7. **Run locally** using VS Code Live Server or:
   ```bash
   npx serve .
   ```

---

## 📁 Project Structure

```
CRM/
├── index.html      # App shell + full dashboard layout
├── style.css       # Design system + responsive breakpoints
├── app.js          # All logic — auth, CRUD, real-time, search, export
├── firebase.js     # Firebase app initialization
├── config.js       # 🔒 Your Firebase config (not committed — add your own)
└── .gitignore      # Excludes config.js from version control
```

---

## 🗺️ Roadmap

- [ ] Edit client details inline
- [ ] Notes / activity log per client
- [ ] Sort by budget, date, or status
- [ ] Budget chart (breakdown by status)
- [ ] Dark / light mode toggle

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!
Feel free to open an issue or submit a pull request.

---

<div align="center">

Built with 🖤 by [Abdelrahman Mohamed](https://github.com/Abdo-mohdev)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abdelrahman-mdev)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Abdo-mohdev)

⭐ If you found this useful, consider starring the repo!

</div>
