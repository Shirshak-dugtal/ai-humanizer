import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { toast } from '../components/Toast'

// Create HTTP link to Hasura
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT || 'http://localhost:8080/v1/graphql',
})

// Auth link to add headers
const authLink = setContext((_, { headers }) => {
  // Get user token from localStorage
  const user = localStorage.getItem('user')
  let token = ''
  
  if (user) {
    try {
      const userData = JSON.parse(user)
      token = userData.token || ''
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'x-hasura-admin-secret': import.meta.env.VITE_HASURA_ADMIN_SECRET || '',
      'x-hasura-role': 'user',
    }
  }
})

// Error link for global error handling
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
      toast.error('GraphQL Error', message)
    })
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`)
    toast.error('Network Error', 'Please check your connection and try again')
  }
})

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      HumanizeJob: {
        fields: {
          status: {
            merge: (existing, incoming) => incoming,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})