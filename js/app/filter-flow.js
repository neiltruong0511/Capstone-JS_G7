import { renderDanhSachSP} from './product-flow.js'
import { el, state } from './core.js'



export const filterSP = () => {
    const keyword = el.searchSP.value.toLowerCase().trim()
    const type = el.filterSP.value

    let ketQua = [...state.danhSachSP]

    // filter keyword
    if (keyword) {
        ketQua = ketQua.filter((phone) => {
            const phoneName = phone.name.toLowerCase()
            const phoneDesc = phone.desc.toLowerCase()
            return phoneName.includes(keyword) || phoneDesc.includes(keyword)
        })
    }

    //  filter khi là loại sản phẩm
    if (type !== "" && type !== "price_asc" && type !== "price_desc") {
        ketQua = ketQua.filter(
            (phone) => phone.type.toLowerCase() === type.toLowerCase()
        )
    }

    // sort
    if (type === "price_asc") {
        ketQua.sort((a, b) => a.price - b.price)
    }

    if (type === "price_desc") {
        ketQua.sort((a, b) => b.price - a.price)
    }

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