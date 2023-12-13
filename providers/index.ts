import compose from 'compose-function'

import withReactQuery from './with-react-query/with-react-query'
import withAuthProvider from './with-auth-provider/with-auth-provider'

const withProviders = compose(withReactQuery, withAuthProvider)

export default withProviders