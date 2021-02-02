import axios from 'axios';

const signup = async (email, password) => {
    return await axios.post("/api/users/signup", {
        email: email,
        password: password
    });
};

export { signup }; 