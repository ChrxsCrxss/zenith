import buildClient from '../api/build-client';
import Header from '../components/header';
import 'bootstrap/dist/css/bootstrap.min.css';

// As we navigate to different pages, Next wraps
// those pages in a app, which basically acts as 
// a thin wrapper for our custom react components
// My defining an file called _app.js, we have 
// defined a custom app component, and we are 
// importing bootstrap at this point to apply
// global styling
const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component{...pageProps} />
        </div>
    )
}

AppComponent.getInitialProps = async (appContext) => {

    const CLIENT = buildClient(appContext.ctx);
    const { data } = await CLIENT.get("api/users/currentuser");

    // Because calling getInitialProps in _app.js conflicts with get
    // getInitialProps in each page, we need to maunaully call the 
    // method for each page and pass the props to the corresponding
    // component 
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    return {
        pageProps,
        ...data
    }
}

export default AppComponent;