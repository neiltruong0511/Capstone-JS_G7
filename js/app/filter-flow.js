import { renderDanhSachSP} from './product-flow.js'
import { el, state } from './core.js'




export const filterSP = () => {
    // B1: lấy giá trị từ ô search và select
    // NGUYÊN TẮC: toLowerCase: chuyển chuỗi về chữ thường, trim: xóa khoảng trắng đầu và cuối chuỗi
    const keyword = el.searchSP.value.toLowerCase().trim()
    const type = el.filterSP.value

    //Tạo biến để lưu kết quả sau khi filter
    let ketQua = [...state.danhSachSP]

    //B2: Lọc sản phẩm theo từ khóa và loại sản phẩm
    //B2.1: filter theo từ khóa
    if (keyword) {
        ketQua = ketQua.filter((phone) => {
            // Tên phone
            const phoneName = phone.name.toLowerCase()
            // mô tả phone
            const phoneDesc = phone.desc.toLowerCase()

            // includes: tìm kiếm tương đối, trả về true nếu chuỗi chứa từ khóa, ngược lại trả về false
            return phoneName.includes(keyword) || phoneDesc.includes(keyword)
        })
    }

    //B2.2: filter theo loại sản phẩm
    if (type != "") { // nếu type khác rỗng (tức là có chọn loại sản phẩm)
        ketQua = ketQua.filter((phone) => phone.type.toLowerCase() === type.toLowerCase())
    }
    // B3: hiển thị kết quả sau khi filter
    renderDanhSachSP(ketQua)
}
const debounce = () => {
    // HỦY TIMER CŨ NẾU USER NHẬP TIẾP
    clearTimeout(state.timerId)

    // TẠO TIMER MỚI, 1s sau gọi hàm filterSP
    state.timerId = setTimeout(() => {
        filterSP()
    }, 1000)
}
el.searchSP.addEventListener("input", debounce)

// select -> event là change
el.filterSP.addEventListener("change", filterSP)

// GOM 2 event vào 1 hàm filterSP để tái sử dụng, tránh lặp code
export const bindFilterEvent = () => {
    el.searchSP.addEventListener("input", debounce)
    // select -> event là change
    el.filterSP.addEventListener("change", filterSP)
}