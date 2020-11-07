import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import './App.css';
import HomePage from './pages/homepage/Homepage'
import ShopPage from './pages/shop/ShopPage'
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/SignInAndSignUpPage'
import CheckoutPage from './pages/checkout/CheckoutPage'
import Header from './components/header/Header'
import { auth, createUserProfileDocument } from './firebase/firebase.utils'
import { setCurrentUser } from './redux/user/user.actions'
import { selectCurrentUser } from './redux/user/user.selector'

class App extends React.Component {
  /* constructor() {
    super()

    this.state = {
      currentUser: null
    }
  } */

  unsubscribeFromAuth = null

  componentDidMount() {
    const { setCurrentUser } = this.props
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth)
        userRef.onSnapshot(snapShot => {
          /* this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          }) */
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          })
        }) 
      } 
      setCurrentUser(userAuth)
    })
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth()
  }

  render() {
    return (
      <div >
        <Header />
        <Switch>
          <Route path='/' component={HomePage} exact />
          <Route path='/shop' component={ShopPage} />
          <Route path='/checkout' component={CheckoutPage} exact />
          <Route
            exact
            path='/signin'
            render={() =>
              this.props.currentUser ? (
                <Redirect to='/' />
              ) : (
                  <SignInAndSignUpPage />
              )} />
        </Switch>
       
      </div>
    );
  } 
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})


export default connect(mapStateToProps, mapDispatchToProps)(App);
