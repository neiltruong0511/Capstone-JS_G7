import { state, el } from "./core.js"
import { capNhatSoLuongGioHang } from './product-flow.js'
import { saveCart } from "./product-flow.js"

// ================= QUANTITY =================
window.tangSoLuong = (phoneId) => {
    const item = state.gioHang.find(p => p.id == phoneId)

    if (!item) return alert("Không tìm thấy sản phẩm")

    item.soLuong++
    capNhatSoLuongGioHang()
    renderGioHang()
}

window.giamSoLuong = (phoneId) => {
    const item = state.gioHang.find(p => p.id == phoneId)

    if (!item) return alert("Không tìm thấy sản phẩm")

    if (item.soLuong === 1) return

    item.soLuong--
    capNhatSoLuongGioHang()
    renderGioHang()
}

window.xoaSanPham = (phoneId) => {
    state.gioHang = state.gioHang.filter(p => p.id != phoneId)

    saveCart()

    capNhatSoLuongGioHang()
    renderGioHang()
}

// ================= RENDER QR =================
const renderQR = () => {
    const qrBox = document.getElementById("qrBox")
    if (!qrBox) return

    if (state.phuongThucThanhToan === "bank") {
        qrBox.innerHTML = `
            <p class="text-sm mb-2">Quét mã chuyển khoản</p>
            <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bank_demo"
                class="mx-auto"
            />
        `
    } 
    else if (state.phuongThucThanhToan === "momo") {
        qrBox.innerHTML = `
            <p class="text-sm mb-2">Quét mã MoMo</p>
            <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=momo_demo"
                class="mx-auto"
            />
        `
    } 
    else {
        qrBox.innerHTML = ""
    }
}

// ================= EVENT PAYMENT =================
const bindPaymentEvent = () => {
    const radios = document.querySelectorAll('input[name="payment"]')

    radios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            state.phuongThucThanhToan = e.target.value
            renderQR()
        })
    })
}

// ================= RENDER CART =================
export const renderGioHang = () => {

    el.popupGioHang.classList.remove("hidden")

    if (state.gioHang.length === 0) {
        el.noiDungGioHang.innerHTML = `
            <div class="flex items-center justify-center w-full h-full text-center">
                <div>
                    <h2 class="text-xl font-bold mb-2">Giỏ hàng</h2>
                    <p class="text-gray-500">Giỏ hàng của bạn đang trống</p>
                </div>
            </div>
        `
        return
    }

    const list = state.gioHang.map(item => {
        const disable = item.soLuong === 1 ? "opacity-30 pointer-events-none" : ""

        return `
        <div class="flex gap-4 p-4 border-b hover:bg-slate-50 transition">

            <!-- IMG -->
            <div class="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                <img src="${item.img}" class="max-w-[85%] max-h-[85%] object-contain"/>
            </div>

            <!-- INFO -->
            <div class="flex-1">
                <h3 class="font-semibold text-slate-800 line-clamp-1">
                    ${item.name}
                </h3>

                <!-- QTY -->
                <div class="flex items-center mt-2">

                  <div class="flex items-center bg-white border border-slate-200 rounded-full shadow-sm overflow-hidden">

                    <button onclick="giamSoLuong(${item.id})"
                      class="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition ${disable}">
                      −
                    </button>

                    <span class="w-10 text-center text-sm font-semibold text-slate-800">
                      ${item.soLuong}
                    </span>

                    <button onclick="tangSoLuong(${item.id})"
                      class="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-800 transition">
                      +
                    </button>

                  </div>

                </div>
            </div>

            <!-- TOTAL -->
            <div class="text-right flex flex-col items-end gap-2">

                <p class="font-bold text-slate-900">
                    ${(item.price * item.soLuong).toLocaleString()} VND
                </p>

                <button onclick="xoaSanPham(${item.id})"
                  class="px-3 py-1 text-sm font-medium text-red-600 
                        hover:text-red-700 transition">
                  Xóa
                </button>

            </div>

        </div>
        `
    })

    const tongTien = state.gioHang.reduce((t, i) => t + i.price * i.soLuong, 0)

    // ✅ render 2 cột
    el.noiDungGioHang.innerHTML = `
        <!-- LEFT -->
        <div class="flex-1 overflow-y-auto">
            ${list.join("")}
        </div>

        <!-- RIGHT -->
        <div class="w-[350px] border-l p-6 bg-slate-50 flex flex-col justify-between">

            <div>
                <h3 class="font-bold text-lg mb-4">Thanh toán</h3>

                <div class="flex justify-between mb-4 text-lg font-semibold">
                    <span>Tổng tiền</span>
                    <span class="text-indigo-600">
                        ${tongTien.toLocaleString()} VND
                    </span>
                </div>

                <div class="space-y-3 text-sm">

                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="payment" value="cod"
                        ${state.phuongThucThanhToan === "cod" ? "checked" : ""}/>
                        Thanh toán khi nhận hàng ( COD )
                    </label>

                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="payment" value="bank"
                        ${state.phuongThucThanhToan === "bank" ? "checked" : ""}/>
                        Ngân hàng
                    </label>

                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="payment" value="momo"
                        ${state.phuongThucThanhToan === "momo" ? "checked" : ""}/>
                        MoMo
                    </label>

                </div>

                <!-- QR -->
                <div id="qrBox" class="mt-4 text-center"></div>
            </div>

            <button onclick="thanhToan()"
                class="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition">
                Thanh toán
            </button>
        </div>
    `

    bindPaymentEvent()
    renderQR()
}

// ================= CHECKOUT =================
window.thanhToan = () => {

    if (state.gioHang.length === 0) {
        return alert("Giỏ hàng trống")
    }

    if (!state.phuongThucThanhToan) {
        return alert("Chọn phương thức thanh toán")
    }

    alert(`Thanh toán thành công bằng ${state.phuongThucThanhToan}`)

    state.gioHang = []
    capNhatSoLuongGioHang()
    renderGioHang()
}