import { el, state } from "./core.js"
import { renderDanhSachSP, renderPagination } from "./ui-flow.js"

// ================= FILTER & SEARCH =================
export const locSanPham = () => {
    const { danhSachSP } = state
    const keyword = el.inputKeyword.value.trim().toLowerCase()
    const sortBy = el.sortDirection.value

    // Lọc theo keyword
    let filtered = danhSachSP
    if (keyword) {
        filtered = danhSachSP.filter(phone =>
            phone.name.toLowerCase().includes(keyword) ||
            phone.type.toLowerCase().includes(keyword)
        )
    }

    // Sắp xếp theo giá
    if (sortBy === "priceAsc") {
        filtered.sort((a, b) => Number(a.price) - Number(b.price))
    } else if (sortBy === "priceDesc") {
        filtered.sort((a, b) => Number(b.price) - Number(a.price))
    }

    state.danhSachSPFilter = filtered
    state.currentPage = 1

    renderCurrentPage()
}

// ================= DEBOUNCE =================
export const debounce = (func, delay) => {
    clearTimeout(state.timerId)
    state.timerId = setTimeout(() => {
        func()
    }, delay)
}

// ================= BIND FILTER EVENTS =================
export const bindFilterEvent = () => {
    // Event search input - debounce 500ms
    el.inputKeyword.addEventListener("input", () => {
        debounce(locSanPham, 500)
    })

    // Event search button
    el.btnSearch.addEventListener("click", locSanPham)

    // Event sort dropdown
    el.sortDirection.addEventListener("change", locSanPham)
}

// ================= APPLY FILTERS AND SORT =================
export const applyFiltersAndSort = () => {
    locSanPham()
}

// ================= RENDER CURRENT PAGE =================
export const renderCurrentPage = () => {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage
    const endIndex = startIndex + state.itemsPerPage
    const currentPageData = state.danhSachSPFilter.slice(startIndex, endIndex)

    renderDanhSachSP(currentPageData)
    renderPagination()
}

// ================= PAGINATION - GLOBAL FUNCTION =================
window.changePage = (pageNumber) => {
    const totalPages = Math.ceil(state.danhSachSPFilter.length / state.itemsPerPage)

    if (pageNumber < 1 || pageNumber > totalPages || isNaN(pageNumber)) {
        return
    }

    state.currentPage = pageNumber
    renderCurrentPage()

    // Smooth scroll to top
    document.documentElement.scrollTop = 0
}
