export const API_URL = "https://69ca67b7ba5984c44bf319d1.mockapi.io/api/v1/phone"

export const el = {
    // Form elements
    productForm: document.getElementById("productForm"),
    name: document.getElementById("name"),
    price: document.getElementById("price"),
    img: document.getElementById("img"),
    screen: document.getElementById("screen"),
    backCamera: document.getElementById("backCamera"),
    frontCamera: document.getElementById("frontCamera"),
    desc: document.getElementById("desc"),
    type: document.getElementById("type"),
    btnSave: document.getElementById("btnSave"),
    btnUpdate: document.getElementById("btnUpdate"),
    btnReset: document.getElementById("btnReset"),

    // Filter & Search
    btnSearch: document.getElementById("btnSearch"),
    inputKeyword: document.getElementById("keyword"),
    sortDirection: document.getElementById("sortDirection"),

    // Product list & render
    productTableBody: document.getElementById("productTableBody"),
    messageBox: document.getElementById("message"),
    paginationContainer: document.getElementById("paginationContainer"),
    
    // Stats
    totalProducts: document.getElementById("totalProducts"),
}

export const state = {
    danhSachSP: [],
    danhSachSPFilter: [],
    editingProduct: null,
    currentPage: 1,
    itemsPerPage: 5,
    searchKeyword: "",
    sortBy: "none",
    timerId: null,
}