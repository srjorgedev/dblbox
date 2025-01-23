export interface Auth {
    message: string
    user: User
    token: string
}

export interface User {
    id: string
    email: string
}
