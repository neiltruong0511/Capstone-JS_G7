import { el } from "./core.js";

const closePopupGioHang = () => {
    el.popupGioHang.classList.add("hidden")
}

const closePopupChiTiet = () => {
    el.popup.classList.add("hidden")
}

// hàm combine các event close popup
export const bindPopupEvent = () => {
    el.overplayGioHang.addEventListener("click", closePopupGioHang)
    el.overplay.addEventListener("click", closePopupChiTiet)
    el.btnClosePopup.addEventListener("click", closePopupChiTiet)
    el.btnClosePopupGioHang.addEventListener("click", closePopupGioHang)
}