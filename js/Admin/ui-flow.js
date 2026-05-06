import { el, state } from "./core.js"

// ================= GET FORM DATA =================
export const getProductDataFromForm = () => {
    return {
        name: el.name.value.trim(),
        price: el.price.value.trim(),
        img: el.img.value.trim(),
        screen: el.screen.value.trim(),
        backCamera: el.backCamera.value.trim(),
        frontCamera: el.frontCamera.value.trim(),
        desc: el.desc.value.trim(),
        type: el.type.value.trim()
    }
}

// ================= RESET FORM =================
export const resetForm = () => {
    el.productForm.reset()
    state.editingProduct = null

    el.btnSave.classList.remove("hidden")
    el.btnUpdate.classList.add("hidden")
}

// ================= RENDER PRODUCT LIST =================
export const renderDanhSachSP = (danhSachSP) => {
    el.productTableBody.innerHTML = ''
    
    if (danhSachSP.length === 0) {
        el.productTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-8 text-gray-400">📭 Không có sản phẩm nào</td>
            </tr>
        `
        return
    }

    const content = danhSachSP.map((phone) => (`
        <tr class="transition-all duration-200 border-b border-gray-200 hover:bg-gray-50">
            <td class="p-4 text-gray-600 font-mono">#${phone.id}</td>
            <td class="p-4 font-semibold text-gray-800">${phone.name}</td>
            <td class="p-4 text-gray-700 font-medium">${Number(phone.price).toLocaleString('vi-VN')} VNĐ</td>
            <td class="p-4">
                <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${phone.type.toLowerCase() === 'iphone' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}">
                    ${phone.type}
                </span>
            </td>
            <td class="p-4">
                <div class="flex gap-2">
                    <button class="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg" onclick="suaSanPham(${phone.id})">✏️ Sửa</button>
                    <button class="bg-gradient-to-br from-red-500 to-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg" onclick="xoaSanPham(${phone.id})">🗑️ Xóa</button>
                </div>
            </td>
        </tr>
    `)).join("")
    
    el.productTableBody.innerHTML = content
}

// ================= SHOW MESSAGE =================
export const showMessage = (message, type = "info") => {
    el.messageBox.innerHTML = message
    el.messageBox.className = "rounded-lg px-5 py-4 font-medium message-box"
    
    if (type === "success") {
        el.messageBox.classList.add("bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-l-4 border-emerald-500")
    } else if (type === "error") {
        el.messageBox.classList.add("bg-gradient-to-br from-red-500 to-red-600 text-white border-l-4 border-red-500")
    }
    
    setTimeout(() => {
        el.messageBox.innerHTML = ""
        el.messageBox.className = ""
    }, 3000)
}

// ================= RENDER PAGINATION =================
export const renderPagination = () => {
    const totalPages = Math.ceil(state.danhSachSPFilter.length / state.itemsPerPage)
    
    if (!el.paginationContainer) {
        return
    }
    
    el.paginationContainer.innerHTML = ''
    
    if (totalPages <= 1) {
        return
    }
    
    // Prev button
    const prevBtn = document.createElement('button')
    prevBtn.textContent = '← Trước'
    prevBtn.className = `transition-all duration-300 border-2 border-gray-200 rounded-lg px-3 py-2 font-medium ${state.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:border-indigo-500 hover:-translate-y-0.5'}`
    prevBtn.disabled = state.currentPage === 1
    prevBtn.addEventListener('click', () => {
        if (state.currentPage > 1) {
            window.changePage(state.currentPage - 1)
        }
    })
    el.paginationContainer.appendChild(prevBtn)
    
    // Page numbers
    const maxVisible = 5
    let startPage = Math.max(1, state.currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1)
    }
    
    if (startPage > 1) {
        const dots = document.createElement('span')
        dots.textContent = '...'
        dots.className = 'px-2 py-2 text-slate-500'
        el.paginationContainer.appendChild(dots)
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button')
        btn.textContent = i
        btn.className = `transition-all duration-300 border-2 border-gray-200 rounded-lg px-3 py-2 font-medium ${i === state.currentPage ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-500' : 'hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:border-indigo-500 hover:-translate-y-0.5'}`
        btn.addEventListener('click', () => {
            window.changePage(i)
        })
        el.paginationContainer.appendChild(btn)
    }
    
    if (endPage < totalPages) {
        const dots = document.createElement('span')
        dots.textContent = '...'
        dots.className = 'px-2 py-2 text-slate-500'
        el.paginationContainer.appendChild(dots)
    }
    
    // Next button
    const nextBtn = document.createElement('button')
    nextBtn.textContent = 'Tiếp →'
    nextBtn.className = `transition-all duration-300 border-2 border-gray-200 rounded-lg px-3 py-2 font-medium ${state.currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:border-indigo-500 hover:-translate-y-0.5'}`
    nextBtn.disabled = state.currentPage === totalPages
    nextBtn.addEventListener('click', () => {
        if (state.currentPage < totalPages) {
            window.changePage(state.currentPage + 1)
        }
    })
    el.paginationContainer.appendChild(nextBtn)
    
    // Info
    const info = document.createElement('div')
    info.innerHTML = `<strong>Trang ${state.currentPage}</strong> / ${totalPages} <span class="opacity-70">• ${state.danhSachSPFilter.length} sản phẩm</span>`
    info.className = 'text-sm font-semibold text-gray-700 ml-6 py-2'
    el.paginationContainer.appendChild(info)
}

// ================= UPDATE STATS =================
export const updateStats = () => {
    if (el.totalProducts) {
        el.totalProducts.textContent = state.danhSachSP.length
    }
}