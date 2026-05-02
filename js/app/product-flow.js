import { el, state, API_URL } from "./core.js"

// ================= POPUP CHI TIẾT =================
window.showChiTietSP = (phoneId) => {
    const phone = state.danhSachSP.find((sp) => sp.id == phoneId)

    if (!phone) {
        alert("Không tìm thấy sản phẩm")
        return
    }

    el.contentPopup.innerHTML = `
    <div class="grid md:grid-cols-2 gap-10 items-center">

  <div class="bg-white rounded-3xl p-4 flex items-center justify-center shadow-lg border overflow-hidden">
    
    <div class="w-[320px] h-[320px] flex items-center justify-center relative rounded-2xl overflow-hidden bg-slate-50">
      
      <img
        src="${phone.img}"
        alt="${phone.name}"
        /* Giải pháp chính: w-full h-full + object-contain + p-6 để tạo khoảng cách an toàn */
        class="relative z-10 w-full h-full object-contain p-6 transition-all duration-500 hover:scale-110"
        onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'"
      >
    </div>

  </div>

  <div class="flex flex-col justify-between h-full">
    
    <div>
      <h2 class="text-3xl font-extrabold text-slate-800 mb-2">
        ${phone.name}
      </h2>

      <p class="text-indigo-600 font-black text-3xl mb-6">
        ${phone.price.toLocaleString()} 
        <span class="text-base text-slate-500">VND</span>
      </p>

      <div class="space-y-3 text-sm">
        <div class="flex justify-between border-b pb-2">
          <span class="text-slate-500">Loại</span>
          <span class="font-semibold">${phone.type}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-slate-500">Màn hình</span>
          <span class="font-semibold">${phone.screen}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-slate-500">Camera trước</span>
          <span class="font-semibold">${phone.frontCamera}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-slate-500">Camera sau</span>
          <span class="font-semibold">${phone.backCamera}</span>
        </div>
      </div>

      <p class="mt-5 text-slate-600 leading-relaxed line-clamp-3">
        ${phone.desc}
      </p>
    </div>

    <div class="flex gap-4 mt-8">
      <button 
        onclick="themVaoGioHang(${phone.id})"
        class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 rounded-xl transition-colors"
      >
        🛒 Thêm vào giỏ
      </button>

      <button 
        onclick="muaNgay(${phone.id})"
        class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all active:scale-95"
      >
        ⚡ Mua ngay
      </button>
    </div>

  </div>
</div>
    `

    el.popup.classList.remove("hidden")
}

//=========== Lưu giỏ hàng vào localStorage ===========
const saveCart = () => {
    localStorage.setItem("gioHang", JSON.stringify(state.gioHang))
}

// ============ Thông báo sản phẩm đc thêm ==========
const showToast = (message) => {
    let toast = document.getElementById("toast")

    if (!toast) {
        toast = document.createElement("div")
        toast.id = "toast"

        toast.style.position = "fixed"
        toast.style.top = "20px"
        toast.style.left = "50%"
        toast.style.transform = "translateX(-50%) translateY(-10px)"
        toast.style.background = "#22c55e"
        toast.style.color = "white"
        toast.style.padding = "12px 24px"
        toast.style.borderRadius = "999px"
        toast.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)"
        toast.style.zIndex = "9999"
        toast.style.opacity = "0"
        toast.style.transition = "all 0.3s ease"

        document.body.appendChild(toast)
    }

    toast.innerText = message

    //  show 
    toast.style.opacity = "1"
    toast.style.transform = "translateX(-50%) translateY(0)"

    //  hide
    setTimeout(() => {
        toast.style.opacity = "0"
        toast.style.transform = "translateX(-50%) translateY(-10px)"
    }, 2000)
}

//======= Load lại khi reload trang ==========
export const loadCart = () => {
    const data = localStorage.getItem("gioHang")

    if (data) {
        state.gioHang = JSON.parse(data)
    } else {
        state.gioHang = []
    }

    capNhatSoLuongGioHang()
}

// ================= GIỎ HÀNG =================
window.themVaoGioHang = (phoneId) => {
    const phone = state.danhSachSP.find((p) => p.id == phoneId)

    if (!phone) {
        alert("Không tìm thấy sản phẩm")
        return
    }

    const item = state.gioHang.find((i) => i.id == phoneId)

    if (!item) {
        state.gioHang.push({ ...phone, soLuong: 1 })
    } else {
        item.soLuong++
    }

    capNhatSoLuongGioHang()

    saveCart()

    showToast(`🛒 Đã thêm ${phone.name} vào giỏ hàng`)
}

// ================= BADGE =================
export const capNhatSoLuongGioHang = () => {
    const tong = state.gioHang.reduce((t, item) => t + item.soLuong, 0)
    el.badgeGioHang.textContent = tong
}

// ================= RENDER =================
export const renderDanhSachSP = (danhSach) => {
    el.danhSachSP.innerHTML = ""

    if (danhSach.length === 0) {
        el.danhSachSP.innerHTML = `
            <p class="text-red-500 text-center">Không tìm thấy sản phẩm</p>
        `
        return
    }

    const content = danhSach.map((phone) => `
        <div class="group bg-white shadow rounded-3xl border border-slate-100 p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2">
  
  <div class="relative overflow-hidden rounded-2xl bg-slate-50 mb-6 aspect-square">
    <img
      src="${phone.img}"
      alt="${phone.name}"
      class="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
    />
  </div>

  <div class="space-y-2">
    <h3 class="font-bold text-lg text-slate-800 line-clamp-1">
      ${phone.name}
    </h3>

    <p class="text-slate-500 text-sm line-clamp-2 leading-relaxed">
      ${phone.desc}
    </p>

    <p class="text-xl font-black text-indigo-600 pt-2 tracking-tight">
      ${phone.price.toLocaleString()} 
      <span class="text-sm font-normal">VND</span>
    </p>
  </div>

  <div class="flex gap-3 mt-6">
    <button
      class="flex-[2] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
      onclick="showChiTietSP(${phone.id})"
    >
      Chi tiết
    </button>

    <button
      class="flex-[3] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-95 hover:shadow-lg"
      onclick="themVaoGioHang(${phone.id})"
    >
      Thêm vào giỏ
    </button>
  </div>

</div>
    `)

    el.danhSachSP.innerHTML = content.join("")
}

// ================= API =================
export const layDanhSachSP = async () => {
    el.loading.classList.remove("hidden")

    try {
        const res = await axios.get(API_URL)
        state.danhSachSP = res.data

        renderDanhSachSP(state.danhSachSP)
    } catch {
        el.danhSachSP.innerHTML = `
            <p class="text-red-500 text-center">Lỗi tải dữ liệu</p>
        `
    }

    el.loading.classList.add("hidden")
}