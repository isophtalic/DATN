import { create } from 'zustand'

const useUserStore = create<UserState>((set) => ({
    user: {
        id: "",
        username: "",
        password: "",
        role: 0,
        updated_at: "0",
    },
    islogin: false,
    login: () => set({ islogin: true }),
    update: (user) => set({ user })
}))

export default useUserStore