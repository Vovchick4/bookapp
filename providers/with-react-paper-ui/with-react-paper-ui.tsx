import { FC, ReactElement } from "react"
import { PaperProvider } from "react-native-paper"

const withReactPaperUi: (Component: FC<any | undefined>) => (args: any) => ReactElement<any, any> = (Component) => (props) => {
    return (
        <PaperProvider>
            <Component {...props} />
        </PaperProvider>
    )
}

export default withReactPaperUi