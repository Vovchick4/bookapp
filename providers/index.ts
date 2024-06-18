import compose from 'compose-function'

import withReactQuery from './with-react-query/with-react-query'
import withStripeProvider from './with-stripe/with-stripe-provider'
import withAuthProvider from './with-auth-provider/with-auth-provider'
import withReactPaperUi from './with-react-paper-ui/with-react-paper-ui'

const withProviders = compose(withReactQuery, withAuthProvider, withReactPaperUi, withStripeProvider)

export default withProviders