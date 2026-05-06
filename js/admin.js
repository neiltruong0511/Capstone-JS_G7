import { layDanhSachSP, taoSanPham, capNhatSanPham } from "./Admin/crud-flow.js"
import { el } from "./Admin/core.js"
import { resetForm } from "./Admin/ui-flow.js"
import { bindFilterEvent } from "./Admin/filter-flow.js"

// ================= BIND FORM EVENTS =================

// Event submit form - Create product
el.productForm.addEventListener("submit", (event) => {
    event.preventDefault()
    taoSanPham()
})

// Event click update button
el.btnUpdate.addEventListener("click", () => {
    capNhatSanPham()
})

// Event click reset button
el.btnReset.addEventListener("click", () => {
    resetForm()
})

// ================= INITIALIZE =================

// Load danh sách sản phẩm khi trang tải
layDanhSachSP()

// Bind filter events (search, sort, pagination)
bindFilterEvent()