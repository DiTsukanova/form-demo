var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
var token = "779856d1ee3079185f5f2816b4e610ce97756c9e";

const company = document.getElementById('party')
const listCompany = document.querySelector('.list')

const throttledDoSomething = throttle(wrapper, 250)

function throttle(callee, timeout) {
    let timer = null
    return function perform(...args) {
        if (timer) return
        timer = setTimeout(() => {
            callee(...args)
            clearTimeout(timer)
            timer = null
        }, timeout)
    }
}

function wrapper(query) {
    fetchComponiesByQuery(query).then(result => {
        addToListCompanies(result)
    })
}

company.addEventListener('input', (e) => {
    throttledDoSomething(e.target.value)
})


function fetchComponiesByQuery(query) {
    var options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        },
        body: JSON.stringify({
            query
        })
    }
    return fetch(url, options)
        .then(response => response.json())
        .then(result => result.suggestions)
}


const fragment = document.createDocumentFragment();

function addToListCompanies(companies) {
    for (const company of companies) {
        const li = document.createElement('li')
        li.classList.add('list__item')
        li.setAttribute("data-company", JSON.stringify({
            shortName: company.data.name.short_with_opf,
            fullName: company.data.name.full_with_opf,
            inn: company.data.inn,
            kpp: company.data.kpp,
            address: company.data.address.value,
            postal_code: company.data.address.data.postal_code,
            type: company.data.type,
        }))
        li.textContent = `${company.data.name.short_with_opf}   ${company.data.inn}  ${company.data.address.value}`
        fragment.appendChild(li)
    }
    listCompany.replaceChildren(fragment)
}

const nameShort = document.getElementById('name_short')
const nameFull = document.getElementById('name_full')
const innKpp = document.getElementById('inn_kpp')
const address = document.getElementById('address')
const typeOrg = document.getElementById('type-org')


listCompany.addEventListener('click', (e) => {
    listCompany.innerHTML = '';
    listCompany.classList.remove('active')
    const dataCompany = JSON.parse(e.target.getAttribute('data-company'))
    company.value = dataCompany.shortName
    console.log(dataCompany.type)
    typeOrg.innerHTML = `Организация (${dataCompany.type})`
    nameShort.value = dataCompany.shortName
    nameFull.value = dataCompany.fullName
    innKpp.value = `${dataCompany.inn} / ${dataCompany.kpp}`
    address.value = `${dataCompany.postal_code}, ${dataCompany.address}`
})

window.addEventListener('click', () => {
    listCompany.innerHTML = ''
})