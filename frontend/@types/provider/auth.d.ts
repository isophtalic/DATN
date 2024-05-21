declare global {
    interface AuthContextInterface {
        login: boolean

        setLogin: (value: boolean) => void

        user: User

        setUser: (value: UserInterface) => void
    }
}
export { }