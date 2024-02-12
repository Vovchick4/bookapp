import { FC, ReactElement } from "react"
import { MD2LightTheme, PaperProvider, useTheme } from "react-native-paper"

const theme = {
    // Extend Material Design 2 theme

    ...MD2LightTheme, // or MD2DarkTheme

    // Specify a custom property
    // myOwnProperty: true,

    // Specify a custom nested property
    colors: {
        ...MD2LightTheme.colors,
        menuColor: '#3F5F5A',
        orangeColor: '#ED8B26',
        grayColor: "#91918F",
        statusPaid: '#3CB371',
        statusPending: "#e5e533",
        statusNoPaid: '#F08080',
        statusCanceled: '#808080',
        statusDeposit: '#F0E68C',
    },
};

export type AppTheme = typeof theme;

export const useAppTheme = () => useTheme<AppTheme>();

const withReactPaperUi: (Component: FC<any | undefined>) => (args: any) => ReactElement<any, any> = (Component) => (props) => {
    return (
        <PaperProvider theme={theme}>
            <Component {...props} />
        </PaperProvider>
    )
}

export default withReactPaperUi