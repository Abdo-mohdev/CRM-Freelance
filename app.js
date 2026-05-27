import { auth, provider, db } from './firebase.js'
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js"
import { collection, addDoc, serverTimestamp, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js"

// ── Elements ──
const authScreen      = document.getElementById('auth-screen')
const appScreen       = document.getElementById('app-screen')
const modalOverlay    = document.getElementById('modal-overlay')
const btnGoogle       = document.getElementById('btn-google')
const btnLogout       = document.getElementById('btn-logout')
const btnShowForm     = document.getElementById('btn-show-form')
const btnCloseModal   = document.getElementById('btn-close-modal')
const inputName       = document.getElementById('input-name')
const inputProject    = document.getElementById('input-project')
const inputStatus     = document.getElementById('input-status')
const inputBudget     = document.getElementById('input-budget')
const inputCountry    = document.getElementById('input-country')
const countryDropdown = document.getElementById('country-dropdown')
const btnAddClient    = document.getElementById('btn-add-client')
const clientsList     = document.getElementById('clients-list')
const inputSearch     = document.getElementById('input-search')
const userName        = document.getElementById('user-name')
const mobileUserName  = document.getElementById('mobile-user-name')
const userDisplayName = document.getElementById('user-display-name')
const userEmail       = document.getElementById('user-email')
const userAvatarWrap  = document.getElementById('user-avatar-wrap')

const statTotal        = document.getElementById('stat-total')
const statBudget       = document.getElementById('stat-budget')
const statInProgress   = document.getElementById('stat-inprogress')
const statDone         = document.getElementById('stat-done')
const clientCountLabel = document.getElementById('client-count-label')

// ── State ──
let currentUser  = null
let allCountries = []
let allClients   = []

// ══════════════════════════════════
// MODAL
// ══════════════════════════════════
function openModal() {
  modalOverlay.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
  setTimeout(() => inputName.focus(), 50)
}

function closeModal() {
  modalOverlay.classList.add('hidden')
  document.body.style.overflow = ''
  // Reset form
  inputName.value = ''
  inputProject.value = ''
  inputBudget.value = ''
  inputCountry.value = ''
  inputCountry.dataset.flag = ''
  inputCountry.dataset.currency = ''
  countryDropdown.classList.add('hidden')
}

btnShowForm.addEventListener('click', openModal)
btnCloseModal.addEventListener('click', closeModal)
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal() })
document.getElementById('sidebar-add-btn')?.addEventListener('click', openModal)
document.getElementById('mobile-add-btn')?.addEventListener('click', openModal)

// ESC to close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) closeModal()
})

// ══════════════════════════════════
// AUTH
// ══════════════════════════════════
btnGoogle.addEventListener('click', () => signInWithPopup(auth, provider))
btnLogout.addEventListener('click', () => signOut(auth))
document.getElementById('mobile-logout-btn')?.addEventListener('click', () => signOut(auth))

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user
    authScreen.classList.add('hidden')
    appScreen.classList.remove('hidden')

    const name  = user.displayName || 'User'
    const email = user.email || ''

    userName.textContent        = `@${name.split(' ')[0].toLowerCase()}`
    mobileUserName.textContent  = name
    userDisplayName.textContent = name
    userEmail.textContent       = email

    if (user.photoURL) {
      userAvatarWrap.innerHTML = `<img src="${user.photoURL}" alt="${name}" />`
    } else {
      userAvatarWrap.textContent = name.charAt(0).toUpperCase()
    }

    getClients()
  } else {
    currentUser = null
    authScreen.classList.remove('hidden')
    appScreen.classList.add('hidden')
  }
})

// ══════════════════════════════════
// SEARCH & FILTER
// ══════════════════════════════════
inputSearch.addEventListener('input', () => renderClients(allClients))

const filterBtns = document.querySelectorAll('.filter-btn')
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    renderClients(allClients)
  })
})

function getActiveFilter() {
  return document.querySelector('.filter-btn.active')?.dataset.filter || 'all'
}

// ══════════════════════════════════
// COUNTRIES
// ══════════════════════════════════
async function loadCountries() {
  try {
    const res  = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,currencies')
    const data = await res.json()
    allCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common))
  } catch(e) { console.warn('Could not load countries', e) }
}

loadCountries()

inputCountry.addEventListener('input', () => {
  const value = inputCountry.value.toLowerCase().trim()
  if (value.length < 2) { countryDropdown.classList.add('hidden'); return }

  const matches = allCountries
    .filter(c => c.name.common.toLowerCase().includes(value))
    .slice(0, 5)

  if (!matches.length) { countryDropdown.classList.add('hidden'); return }

  countryDropdown.classList.remove('hidden')
  countryDropdown.innerHTML = matches.map(c => {
    const currencyKey    = Object.keys(c.currencies || {})[0]
    const currencyName   = currencyKey ? c.currencies[currencyKey].name   : ''
    const currencySymbol = currencyKey ? c.currencies[currencyKey].symbol : ''
    const currency       = currencyKey ? `${currencyName} (${currencySymbol})` : ''
    return `
      <div class="dropdown-item"
        onclick="selectCountry('${c.name.common.replace(/'/g,"\\'")}','${c.flags.png}','${currency.replace(/'/g,"\\'")}')">
        <img src="${c.flags.png}" width="20" height="14" style="border-radius:2px" />
        ${c.name.common}
      </div>
    `
  }).join('')
})

function selectCountry(name, flagUrl, currency) {
  inputCountry.value            = name
  inputCountry.dataset.flag     = flagUrl
  inputCountry.dataset.currency = currency
  countryDropdown.classList.add('hidden')
}
window.selectCountry = selectCountry

// ══════════════════════════════════
// ADD CLIENT
// ══════════════════════════════════
async function addClient() {
  const name            = inputName.value.trim()
  const project         = inputProject.value.trim()
  const status          = inputStatus.value
  const budget          = Number(inputBudget.value) || 0
  const country         = inputCountry.value.trim()
  const countryFlag     = inputCountry.dataset.flag     || ''
  const countryCurrency = inputCountry.dataset.currency || ''

  // Validate
  let hasError = false
  if (!name)    { inputName.style.borderColor    = 'var(--red)'; hasError = true }
  if (!project) { inputProject.style.borderColor = 'var(--red)'; hasError = true }
  if (hasError) {
    setTimeout(() => {
      inputName.style.borderColor    = ''
      inputProject.style.borderColor = ''
    }, 1500)
    return
  }

  btnAddClient.textContent = 'Adding…'
  btnAddClient.disabled    = true

  try {
    await addDoc(collection(db, 'users', currentUser.uid, 'clients'), {
      name, project, status, budget,
      country, countryFlag, countryCurrency,
      createdAt: serverTimestamp()
    })
    closeModal()
  } catch(e) {
    console.error('Error adding client:', e)
    alert('Failed to add client. Check your connection.')
  } finally {
    btnAddClient.textContent = '+ Add Client'
    btnAddClient.disabled    = false
  }
}

btnAddClient.addEventListener('click', addClient)

// ══════════════════════════════════
// STATS
// ══════════════════════════════════
function updateStats(clients) {
  const total       = clients.length
  const totalBudget = clients.reduce((sum, c) => sum + (Number(c.budget) || 0), 0)
  const inProgress  = clients.filter(c => c.status === 'In Progress').length
  const done        = clients.filter(c => c.status === 'Done').length

  statTotal.textContent      = total
  statBudget.textContent     = '$' + totalBudget.toLocaleString()
  statInProgress.textContent = inProgress
  statDone.textContent       = done
  clientCountLabel.textContent = `${total} client${total !== 1 ? 's' : ''} total`
}

// ══════════════════════════════════
// RENDER CLIENTS
// ══════════════════════════════════
function renderClients(clients) {
  const search = inputSearch.value.toLowerCase().trim()
  const filter = getActiveFilter()

  const filtered = clients.filter(({ client: c }) => {
    const name    = (c.name    || '').toLowerCase()
    const project = (c.project || '').toLowerCase()
    const matchSearch = !search || name.includes(search) || project.includes(search)
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  if (filtered.length === 0) {
    clientsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🗂</div>
        <p>${clients.length === 0
          ? 'No clients yet.<br>Add your first one with the button above.'
          : 'No clients match your search or filter.'}</p>
      </div>
    `
    return
  }

  clientsList.innerHTML = filtered.map(({ id, client: c }) => {
    const statusClass = (c.status || 'pending').toLowerCase().replace(/\s+/g, '-')
    const budget      = (Number(c.budget) || 0).toLocaleString()

    const countryHTML = c.country ? `
      <div class="country-row">
        ${c.countryFlag ? `<img src="${c.countryFlag}" width="15" height="11" style="border-radius:2px" />` : ''}
        ${c.country}
      </div>
      ${c.countryCurrency ? `<div class="currency-label">${c.countryCurrency}</div>` : ''}
    ` : `<span style="color:var(--muted);font-size:12px">—</span>`

    return `
      <div class="client-card">
        <div class="info">
          <h3>${c.name || '—'}</h3>
          <p class="project">${c.project || '—'}</p>
        </div>
        <div class="country-col">${countryHTML}</div>
        <span class="status ${statusClass}">${c.status || 'Pending'}</span>
        <span class="budget">$${budget}</span>
        <button class="btn-delete" onclick="deleteClient('${id}')" title="Delete client">✕</button>
      </div>
    `
  }).join('')
}

// ══════════════════════════════════
// GET CLIENTS (real-time)
// ══════════════════════════════════
function getClients() {
  onSnapshot(collection(db, 'users', currentUser.uid, 'clients'), snapshot => {
    allClients = snapshot.docs.map(d => ({ id: d.id, client: d.data() }))
    updateStats(allClients.map(c => c.client))
    renderClients(allClients)
  })
}

// ══════════════════════════════════
// DELETE CLIENT
// ══════════════════════════════════
async function deleteClient(id) {
  if (!confirm('Delete this client?')) return
  try {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'clients', id))
  } catch(e) {
    alert('Could not delete. Check your connection.')
  }
}
window.deleteClient = deleteClient

// ══════════════════════════════════
// EXPORT CSV
// ══════════════════════════════════
function exportCSV() {
  if (allClients.length === 0) {
    alert('No clients to export yet!')
    return
  }

  const rows = [['Name', 'Project', 'Status', 'Budget', 'Country', 'Currency']]

  allClients.forEach(({ client: c }) => {
    rows.push([
      c.name            || '',
      c.project         || '',
      c.status          || '',
      c.budget          || 0,
      c.country         || '',
      c.countryCurrency || ''
    ])
  })

  const csv  = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `clients-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

document.getElementById('btn-export').addEventListener('click', exportCSV)
