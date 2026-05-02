import { renderGioHang } from './app/cart-flow.js'
import { el } from './app/core.js'
import { bindFilterEvent } from './app/filter-flow.js'
import { bindPopupEvent } from './app/popup-flow.js'
import { layDanhSachSP } from './app/product-flow.js'
import { loadCart } from './app/product-flow.js'

//add tất cả những event cho thẻ input, select, button,...
bindFilterEvent()
bindPopupEvent()

// add event hiển thị giỏ hàng khi click vào nút giỏ hàng
el.btnGioHang.addEventListener("click", renderGioHang)

// Load lại khi reload trang
loadCart()

//gọi hàm hiển thị danh sách sản phẩm khi load trang
layDanhSachSP()