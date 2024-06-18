import { FC, ReactElement } from "react"
import { StripeProvider } from '@stripe/stripe-react-native';

import { publishableKey } from "../../constants/app";

const withStripeProvider: (Component: FC<any | undefined>) => (args: any) => ReactElement<any, any> = (Component) => (props) => {
    return (
        <StripeProvider
            publishableKey={publishableKey}
            // merchantIdentifier="merchant.identifier" // required for Apple Pay
            urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        >
            <Component {...props} />
        </StripeProvider>
    )
}

export default withStripeProvider