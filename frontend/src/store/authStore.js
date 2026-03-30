import { create } from 'zustand'

const TOKEN_KEY = 'nedu_token'
const USER_KEY = 'nedu_user'

function safeParse(json, fallback) {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

const initialToken =
  typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) || '' : ''
const initialUser =
  typeof window !== 'undefined' ? safeParse(localStorage.getItem(USER_KEY), null) : null

export const useAuthStore = create((set, get) => ({
  token: initialToken,
  user: initialUser, // { id, email, role, name, avatar, level }
  loadingProfile: false,

  initFromStorage: () => set({ token: initialToken, user: initialUser }),

  setAuth: ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    set({ token: '', user: null })
  },

  // Lấy profile để hiển thị name/role/avatar và kiểm tra quyền admin
  fetchProfile: async ({ api }) => {
    const state = get()
    if (!state.token) return

    set({ loadingProfile: true })
    try {
      const res = await api.get('/api/users/profile')
      // API trả về user
      set({ user: res.data.user })
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user))
    } catch (e) {
      // Nếu token hết hạn => đăng xuất
      get().logout()
    } finally {
      set({ loadingProfile: false })
    }
  },
}))

