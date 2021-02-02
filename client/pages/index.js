import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
    console.log('I am in the component', currentUser);

    if (!currentUser) {
        return <h1> You are not signed in </h1>
    } else {
        return (
            <div>
                <h1>Welcome back</h1>
                <h3>Your email is {currentUser.email}</h3>
                <h3>Your hashed id is {currentUser.id}</h3>
            </div>
        )

    }
};

LandingPage.getInitialProps = async (context) => {
    const CLIENT = buildClient(context);
    const { data } = await CLIENT.get("api/users/currentuser");
    return data;
}

export default LandingPage