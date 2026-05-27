import { auth, provider, db } from './firebase.js'
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js"
import { collection, addDoc, serverTimestamp, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js"// ── Elements ──
const authScreen   = document.getElementById('auth-screen')
const appScreen    = document.getElementById('app-screen')
const btnGoogle    = document.getElementById('btn-google')
const btnLogout    = document.getElementById('btn-logout')

// ── Google Sign In ──
btnGoogle.addEventListener('click', () => {
  signInWithPopup(auth, provider)
})

// ── Logout ──
btnLogout.addEventListener('click', () => {
  signOut(auth)
})

// ── Auth State ──
onAuthStateChanged(auth, user => {
  if (user) {
    authScreen.classList.add('hidden')
    appScreen.classList.remove('hidden')

    getClients()

    // ضيف اسم الـ user
    document.getElementById('user-name').textContent = `👋 ${user.displayName}`
  } else {
    authScreen.classList.remove('hidden')
    appScreen.classList.add('hidden')
  }
})


// ── Elements ── ضيف هنا
const inputName    = document.getElementById('input-name')
const inputProject = document.getElementById('input-project')
const inputStatus  = document.getElementById('input-status')
const inputBudget  = document.getElementById('input-budget')
const btnAddClient = document.getElementById('btn-add-client')

// ── Add Client Function ──
async function addClient() {
  const name    = inputName.value
  const project = inputProject.value
  const status  = inputStatus.value
  const budget  = Number(inputBudget.value)

  if (name.trim() === '' || project.trim() === '') {
    alert('Please fill in all fields!')
    return
  }

  await addDoc(collection(db, 'clients'), {
    name,
    project,
    status,
    budget,
    createdAt: serverTimestamp()
  })

  inputName.value    = ''
  inputProject.value = ''
  inputBudget.value  = ''
}

btnAddClient.addEventListener('click', addClient)


// ── Get Clients ──
function getClients() {
  const clientsList = document.getElementById('clients-list')

  onSnapshot(collection(db, 'clients'), snapshot => {
    // snapshot = كل الـ documents اللي في الـ collection

    clientsList.innerHTML = snapshot.docs.map(doc => {
      const client = doc.data() // ← جيب البيانات من الـ document
      return `
        <div class="client-card">
        <div class="info">
        <h3>${client.name}</h3>
        <p class="project">${client.project}</p>
        </div>
        <span class="status ${client.status.toLowerCase().replace(' ', '-')}">
        ${client.status}
        </span>
        <span class="budget">$${client.budget}</span>
        <button class="btn-delete" onclick="deleteClient('${doc.id}')">✕</button>
        </div>
        `
    }).join('')
  })
}


// ── Delete Client ──
async function deleteClient(id) {
  await deleteDoc(doc(db, 'clients', id))
}
window.deleteClient = deleteClient // ← ضيف السطر ده ✅
