import { FC, ReactElement } from "react"
import AuthProvider from "../../contexts/auth"

const withAuthProvider: (Component: FC<any | undefined>) => (args: any) => ReactElement<any, any> = (Component) => (props) => {
    return (
        <AuthProvider>
            <Component {...props} />
        </AuthProvider>
    )
}

export default withAuthProvider