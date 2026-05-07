import { API_URL, el, state } from "./core.js"
import { getProductDataFromForm, renderDanhSachSP, resetForm, showMessage, updateStats } from "./ui-flow.js"
import { applyFiltersAndSort } from "./filter-flow.js"

// ================= FETCH DANH SÁCH SẢN PHẨM =================
export const layDanhSachSP = async () => {
    try {
        const response = await axios.get(API_URL)
        state.danhSachSP = response.data
        state.danhSachSPFilter = response.data
        
        renderDanhSachSP(state.danhSachSP)
        updateStats()
        applyFiltersAndSort()
    } catch (error) {
        el.productTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-red-500">❌ Có lỗi xảy ra khi tải dữ liệu</td>
            </tr>
        `
        console.error(error)
    }
}

// ================= VALIDATION =================
export const validateProduct = (product) => {
    if (!product.name || product.name.length < 3) {
        return { valid: false, message: "❌ Tên sản phẩm phải có ít nhất 3 ký tự" }
    }
    if (!product.price || Number(product.price) <= 0) {
        return { valid: false, message: "❌ Giá sản phẩm phải lớn hơn 0" }
    }
    if (!product.img) {
        return { valid: false, message: "❌ Hình ảnh không được để trống" }
    }
    if (!product.type) {
        return { valid: false, message: "❌ Loại sản phẩm không được để trống" }
    }
    return { valid: true, message: "✅ Dữ liệu hợp lệ" }
}

// ================= TẠO SẢN PHẨM =================
export const taoSanPham = async () => {
    const newProduct = getProductDataFromForm()
    const validation = validateProduct(newProduct)
    
    if (!validation.valid) {
        showMessage(validation.message, "error")
        return
    }
    
    try {
        await axios.post(API_URL, newProduct)
        showMessage("✅ Tạo mới sản phẩm thành công!", "success")
        resetForm()
        await layDanhSachSP()
    } catch (error) {
        showMessage("❌ Có lỗi xảy ra khi tạo mới sản phẩm", "error")
        console.error(error)
    }
}

// ================= CẬP NHẬT SẢN PHẨM =================
export const capNhatSanPham = async () => {
    if (!state.editingProduct) {
        showMessage("❌ Không có sản phẩm nào được chọn để cập nhật", "error")
        return
    }
    
    const updatedProduct = getProductDataFromForm()
    const validation = validateProduct(updatedProduct)
    
    if (!validation.valid) {
        showMessage(validation.message, "error")
        return
    }
    
    try {
        await axios.put(`${API_URL}/${state.editingProduct.id}`, updatedProduct)
        showMessage("✅ Cập nhật sản phẩm thành công!", "success")
        resetForm()
        await layDanhSachSP()
    } catch (error) {
        showMessage("❌ Có lỗi xảy ra khi cập nhật sản phẩm", "error")
        console.error(error)
    }
}

// ================= XÓA SẢN PHẨM =================
const xoaSanPhap = async (productId) => {
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")
    if (!isConfirmed) {
        return
    }
    
    try {
        await axios.delete(`${API_URL}/${productId}`)
        showMessage("✅ Xóa sản phẩm thành công!", "success")
        await layDanhSachSP()
    } catch (error) {
        showMessage("❌ Có lỗi xảy ra khi xóa sản phẩm", "error")
        console.error(error)
    }
}

// ================= GLOBAL FUNCTIONS FOR ONCLICK HANDLERS =================
// Hàm sửa sản phẩm - được gọi từ button onclick trong table
window.suaSanPham = (productId) => {
    const product = state.danhSachSP.find((phone) => phone.id == productId)
    
    if (!product) {
        showMessage("❌ Không tìm thấy sản phẩm", "error")
        return
    }
    
    state.editingProduct = product
    
    el.name.value = product.name
    el.price.value = product.price
    el.img.value = product.img
    el.screen.value = product.screen
    el.backCamera.value = product.backCamera
    el.frontCamera.value = product.frontCamera
    el.desc.value = product.desc
    el.type.value = product.type
    
    el.btnUpdate.classList.remove("hidden")
    el.btnSave.classList.add("hidden")
    
    // Scroll to form
    el.productForm.scrollIntoView({ behavior: "smooth" })
}

// Hàm xóa sản phẩm - được gọi từ button onclick trong table
window.xoaSanPham = (productId) => {
    xoaSanPhap(productId)
}