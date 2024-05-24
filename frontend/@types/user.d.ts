declare global {
    interface UserInterface {
        id: string;
        email: string,
        created_at: string;
        role: int;
        updated_at: string;
    }

    interface UserAccountInterface {
        username: string;

        password: string;

    }

    type UserInput = Partial<UserAccountInterface> & Partial<UserInterface>

    interface UserState {
        user: UserInput;
        islogin: boolean;
        login: () => void;
        update: (user: UserInput) => void;
    }

    type ChangePassword = {
        oldpass: string
        newpass: string
    }

    interface UserJwtPayload {
        role: number,
        iss: string,
        sub: string,
        aud: string[],
        exp: number,
        iat: number,
        jti: string
    }
}

export { };