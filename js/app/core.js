export const API_URL = "https://69ca67b7ba5984c44bf319d1.mockapi.io/api/v1/phone"

export const el = {
    danhSachSP: document.getElementById("danhSachSP"),
    loading: document.getElementById("loading"),
    searchSP: document.getElementById("searchInput"),
    filterSP: document.getElementById("filterSelect"),
    //Popup 
    popup: document.getElementById("popupChiTiet"),
    btnClosePopup: document.getElementById("btnClose"),
    btnClosePopupGioHang: document.getElementById("btnCloseGioHang"),
    contentPopup: document.getElementById("popupContent"),
    overplay: document.getElementById("overplay"),

    //Popup Giỏ hàng
    popupGioHang: document.getElementById("popupGioHang"),
    overplayGioHang: document.getElementById("overplayGioHang"),
    btnGioHang: document.getElementById("btnGioHang"),
    
    // Dom tới số lượng sản phẩm trong giỏ hàng
    badgeGioHang: document.getElementById("badgeGioHang"),
    noiDungGioHang: document.getElementById("noiDungGioHang")
}

export const state = {
    danhSachSP: [],
    gioHang: [],
    timerId: null
}