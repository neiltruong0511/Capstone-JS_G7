import { state, el } from "./core.js"
import { capNhatSoLuongGioHang } from './product-flow.js'

window.tangSoLuong = (phoneId) => {
    //tìm sản phẩm trong giỏ hàng dựa trên id
    const item = state.gioHang.find((phone) => phone.id == phoneId)
    
    // Nếu không tìm thấy sản phẩm thì hiển thị thông báo lỗi 
    if (!item) {
        alert("Không tìm thấy sản phẩm trong giỏ hàng")
        return
    }

    // nếu tìm thấy sản phẩm thì tăng số lượng lên 1
    item.soLuong += 1
    
    // cập nhật lại số lượng sản phẩm trong giỏ hàng hiển thị ở badge
    capNhatSoLuongGioHang()

    // render: lại giỏ hàng để cập nhật số lượng và tổng tiền
    renderGioHang()
}

window.giamSoLuong = (phoneId) => {
    // tìm sản phẩm trong giỏ hàng dựa trên id
    const item = state.gioHang.find((phone) => phone.id == phoneId)

    // nếu không tìm thấy sản phẩm thì hiển thị thông báo lỗi
    if (!item) {
        alert("Không tìm thấy sản phẩm trong giỏ hàng")
        return
    }
    // nếu tìm thấy sản phẩm
    // nếu số lượng bằng 1 => không cho giảm nữa
    if (item.soLuong === 1) {
        return
    }

    // nếu số lượng lớn hơn 1 thì giảm số lượng xuống 1
    item.soLuong -= 1

    // cập nhật lại số lượng sản phẩm trong giỏ hàng hiển thị ở badge
    capNhatSoLuongGioHang()

    // render lại giỏ hàng để cập nhật số lượng và tổng tiền
    renderGioHang()
}

window.xoaSanPham = (phoneId) => {
    // cập nhật mảng giỏ hàng không chứa sản phẩm muốn xóa
    state.gioHang = state.gioHang.filter((phone) => phone.id != phoneId)

    // cập nhật lại số lượng sản phẩm trong giỏ hàng hiển thị ở badge
    capNhatSoLuongGioHang()

    // render lại giỏ hàng để cập nhật danh sách và tổng tiền
    renderGioHang()
}

export const renderGioHang = () => {
    // nếu giỏ hàng trống thì hiển thị thông báo
    if(state.gioHang.length === 0) {
        el.popupGioHang.classList.remove("hidden")
        el.noiDungGioHang.innerHTML = `
            <h2>Giỏ hàng</h2>
            <p class="text-gray-500 text-center">Giỏ hàng của bạn đang trống</p>
        `
        return
    }
    
    // tạo html để hiển thị giỏ hàng
    // list item -> map -> list html -> join("") -> string html -> innerHTML
    const contentHtmlList = state.gioHang.map((item) => {
        // thêm logic disable button giảm số lượng khi số lượng bằng 1, không cho giảm nữa
        const disableGiam = item.soLuong === 1 ? "disabled opacity-50 cursor-not-allowed" : ""

        return  `
           <div class="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">

              <!-- IMAGE -->
              <div class="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                <img 
                  src="${item.img}" 
                  alt="${item.name}" 
                  class="max-w-[85%] max-h-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <!-- INFO -->
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-slate-800 line-clamp-1 text-[15px]">
                  ${item.name}
                </h3>

                <p class="text-slate-500 text-xs mt-1">
                  Giá:
                </p>

                <div class="text-indigo-600 font-bold text-sm">
                  ${item.price.toLocaleString()} VND
                </div>
              </div>

              <!-- QUANTITY -->
              <div class="flex items-center bg-slate-100 rounded-full px-2 py-1 shadow-inner">

                <!-- MINUS -->
                <button
                  onclick="giamSoLuong(${item.id})"
                  class="w-8 h-8 flex items-center justify-center rounded-full 
                        text-slate-500 hover:bg-slate-200 active:scale-95 
                        transition-all duration-200 ${disableGiam}"
                >
                  −
                </button>

                <!-- NUMBER -->
                <span class="w-10 text-center font-semibold text-slate-800 text-sm">
                  ${item.soLuong}
                </span>

                <!-- PLUS -->
                <button
                  onclick="tangSoLuong(${item.id})"
                  class="w-8 h-8 flex items-center justify-center rounded-full 
                        text-black shadow-md 
                        hover:bg-slate-200 active:scale-95 
                        transition-all duration-200"
                >
                  +
                </button>
              </div>

              <!-- TOTAL PRICE -->
              <div class="w-32 text-right">
                <p class="text-xs text-slate-400">Tổng</p>
                <p class="font-bold text-slate-900 text-[15px]">
                  ${(item.price * item.soLuong).toLocaleString()}
                  <span class="text-xs font-medium text-slate-400">VND</span>
                </p>
              </div>

              <!-- DELETE -->
              <button
                onclick="xoaSanPham(${item.id})"
                class="ml-2 w-9 h-9 flex items-center justify-center rounded-full 
                      text-slate-400 hover:text-red-500 hover:bg-red-50 
                      transition-all duration-200"
              >
                ✕
              </button>

            </div>
        `
    })

    // gộp tất cả các thẻ html lại thành một chuỗi và hiển thị lên trang
    el.noiDungGioHang.innerHTML = contentHtmlList.join("")

    //Thêm logic tính tổng tiền của giỏ hàng 
    const tongTien = state.gioHang.reduce((tong, item) => tong + item.price * item.soLuong, 0) 

    //Ghép html hiển thị tổng tiền vào cuối nội dung giỏ hàng
    el.noiDungGioHang.innerHTML += `
        <div class="flex justify-end py-4 px-3">
            <p class="text-lg font-bold text-gray-900">Tổng tiền: ${tongTien.toLocaleString()} <span class="text-xs uppercase">vnd</span></p>
        </div>
    `
    // remove class hidden của popup giỏ hàng để hiển thị popup
    el.popupGioHang.classList.remove("hidden")
}