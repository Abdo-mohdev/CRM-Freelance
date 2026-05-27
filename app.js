import { auth, provider, db } from './firebase.js'
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js"
import { collection, addDoc, serverTimestamp, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js"

// ── Elements ──
const authScreen   = document.getElementById('auth-screen')
const appScreen    = document.getElementById('app-screen')
const btnGoogle    = document.getElementById('btn-google')
const btnLogout    = document.getElementById('btn-logout')
const inputName    = document.getElementById('input-name')
const inputProject = document.getElementById('input-project')
const inputStatus  = document.getElementById('input-status')
const inputBudget  = document.getElementById('input-budget')
const btnAddClient = document.getElementById('btn-add-client')
const clientsList  = document.getElementById('clients-list')
const inputSearch  = document.getElementById('input-search')

// ── Current User ──
let currentUser = null


// ── Auth ──
btnGoogle.addEventListener('click', () => signInWithPopup(auth, provider))
btnLogout.addEventListener('click', () => signOut(auth))

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user
    authScreen.classList.add('hidden')
    appScreen.classList.remove('hidden')
    document.getElementById('user-name').textContent = `👋 ${user.displayName}`
    getClients()
  } else {
    currentUser = null
    authScreen.classList.remove('hidden')
    appScreen.classList.add('hidden')
  }
})


// ── Search ──
inputSearch.addEventListener('input', () => {
  const searchValue = inputSearch.value.toLowerCase()
  const cards = document.querySelectorAll('.client-card')
  cards.forEach(card => {
    const name = card.querySelector('h3').textContent.toLowerCase()
    card.style.display = name.includes(searchValue) ? 'flex' : 'none'
  })
})


// ── Add Client ──
async function addClient() {
  const name    = inputName.value
  const project = inputProject.value
  const status  = inputStatus.value
  const budget  = Number(inputBudget.value)

  if (name.trim() === '' || project.trim() === '') {
    alert('Please fill in all fields!')
    return
  }

  await addDoc(collection(db, 'users', currentUser.uid, 'clients'), {
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
  onSnapshot(collection(db, 'users', currentUser.uid, 'clients'), snapshot => {
    clientsList.innerHTML = snapshot.docs.map(doc => {
      const client = doc.data()
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
  await deleteDoc(doc(db, 'users', currentUser.uid, 'clients', id))
}
window.deleteClient = deleteClient


// ── Filter ──
const filterBtns = document.querySelectorAll('.filter-btn')

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {

    // 1. شيل active من كل الأزرار
    filterBtns.forEach(b => b.classList.remove('active'))

    // 2. ضيف active على اللي اتضغط
    btn.classList.add('active')

    // 3. جيب الـ filter value
    const filter = btn.dataset.filter

    // 4. لف على كل card
    const cards = document.querySelectorAll('.client-card')
    cards.forEach(card => {
      const status = card.querySelector('.status').textContent.trim()

      if (filter === 'all') {
        card.style.display = 'flex'      // ← ورّي الكل
      } else if (status === filter) {
        card.style.display = 'flex'      // ← ورّي اللي يطابق
      } else {
        card.style.display = 'none'      // ← خبّي الباقي
      }
    })
  })
})





