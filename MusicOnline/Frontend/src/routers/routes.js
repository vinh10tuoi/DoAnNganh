import React, { Suspense, lazy } from "react";
import { Layout } from 'antd';
import { withRouter } from "react-router";
import Footer from '../components/layout/footer/footer';
import Header from '../components/layout/header/header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import NotFound from '../components/notFound/notFound';
import Sidebar from '../components/layout/sidebar/sidebar';
import LoadingScreen from '../components/loading/loadingScreen';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';

const { Content } = Layout;

const Login = lazy(() => {
    return Promise.all([
        import('../pages/Login/login'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


// const AccountManagement = lazy(() => {
//     return Promise.all([
//         import('../pages/AccountManagement/accountManagement'),
//         new Promise(resolve => setTimeout(resolve, 0))
//     ])
//         .then(([moduleExports]) => moduleExports);
// });


// const AccountCreate = lazy(() => {
//     return Promise.all([
//         import('../pages/AccountManagement/AccountCreate/accountCreate'),
//         new Promise(resolve => setTimeout(resolve, 0))
//     ])
//         .then(([moduleExports]) => moduleExports);
// });

const ProductList = lazy(() => {
    return Promise.all([
        import('../pages/ProductList/productList'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const CategoryList = lazy(() => {
    return Promise.all([
        import('../pages/CategoryList/categoryList'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const DashBoard = lazy(() => {
    return Promise.all([
        import('../pages/DashBoard/dashBoard'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const Profile = lazy(() => {
    return Promise.all([
        import('../pages/Profile/profile'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const OrderList = lazy(() => {
    return Promise.all([
        import('../pages/OrderList/orderList'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Music = lazy(() => {
    return Promise.all([
        import('../pages/Music/music'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Register = lazy(() => {
    return Promise.all([
        import('../pages/Register/register'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const RouterURL = withRouter(({ location }) => {

    const checkAuth = () => {
        return localStorage.getItem('role');
    }

    const LoginContainer = () => (
        <div>
            <PublicRoute exact path="/">
                <Suspense fallback={<LoadingScreen />}>
                    <Login />
                </Suspense>
            </PublicRoute>
            
            <PublicRoute exact path="/login">
                <Login />
            </PublicRoute>

            <PublicRoute exact path="/register">
                <Register />
            </PublicRoute>
        </div>
    )

    const DefaultContainer = () => (
        <PrivateRoute>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout >
                    <Header />
                    <Content style={{ marginLeft: 230, width: 'calc(100% - 230px)', marginTop: 50 }}>
                        <PrivateRoute exact path="/dash-board">
                            <Suspense fallback={<LoadingScreen />}>
                                <DashBoard />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/profile">
                            <Suspense fallback={<LoadingScreen />}>
                                <Profile />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/notfound">
                            <NotFound />
                        </PrivateRoute>

                        {/* <PrivateRoute exact path="/account-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <AccountManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/account-create">
                            <Suspense fallback={<LoadingScreen />}>
                                <AccountCreate />
                            </Suspense>
                        </PrivateRoute> */}
                        <PrivateRoute exact path="/notfound">
                            <NotFound /></PrivateRoute>
                      
                        <PrivateRoute exact path="/product-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <ProductList />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/order-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <OrderList />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/category-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <CategoryList />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/music">
                            <Suspense fallback={<LoadingScreen />}>
                                <Music />
                            </Suspense>
                        </PrivateRoute>

                         <PrivateRoute exact path="/register">
                            <Suspense fallback={<LoadingScreen />}>
                                <Register />
                            </Suspense>
                        </PrivateRoute>
                       
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </PrivateRoute >
    )

    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/login">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/reset-password/:id">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/dash-board">
                        <DefaultContainer />
                    </Route>
                   
                    <Route exact path="/account-create">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/account-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/music">
                        <DefaultContainer />
                    </Route>
                  
                    <Route exact path="/product-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/category-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/profile">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/order-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/register">
                        <LoginContainer />
                    </Route>
                   
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
})

export default RouterURL;
