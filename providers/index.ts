import compose from 'compose-function'

import withReactQuery from './with-react-query/with-react-query'
import withAuthProvider from './with-auth-provider/with-auth-provider'
import withReactPaperUi from './with-react-paper-ui/with-react-paper-ui'

const withProviders = compose(withReactQuery, withAuthProvider, withReactPaperUi)

export default withProviders