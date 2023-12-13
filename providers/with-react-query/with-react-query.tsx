import { useEffect, FC, ReactElement } from "react"
import { Platform, AppState, AppStateStatus } from "react-native"
import {
    QueryClient,
    QueryClientProvider,
    focusManager,
    onlineManager,
} from '@tanstack/react-query'
import NetInfo from '@react-native-community/netinfo'

function onAppStateChange(status: AppStateStatus) {
    // React Query already supports in web browser refetch on window focus by default
    if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active')
    }
}

export const queryClient = new QueryClient()

const withReactQuery: (Component: FC<any | undefined>) => (args: any) => ReactElement<any, any> = (Component) => (props) => {
    useEffect(() => {
        // React Query already supports on reconnect auto refetch in web browser
        if (Platform.OS !== 'web') {
            return NetInfo.addEventListener((state) => {
                onlineManager.setOnline(
                    state.isConnected != null &&
                    state.isConnected &&
                    Boolean(state.isInternetReachable),
                )
            })
        }
    }, [])

    useEffect(() => {
        const subscription = AppState.addEventListener('change', onAppStateChange)
        return () => {
            subscription.remove()
        }
    }, [onAppStateChange])

    return (
        <QueryClientProvider client={queryClient}>
            <Component {...props} />
        </QueryClientProvider>
    )
}

export default withReactQuery