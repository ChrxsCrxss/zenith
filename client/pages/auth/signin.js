import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { doRequest, errors } = useRequest({
        url: "/api/users/signin",
        method: "post",
        body: {
            email: email,
            password: password
        },
        onSuccess: () => Router.push("/")
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        // await async doRequest Method and redirect to 
        await doRequest();
    }
    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Email Address</label>
                <input className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}></input>
                <label>Password</label>
                <input className="form-control"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}></input>
                {errors}
                <button className="btn-primary">Sign In</button>
            </div>
            <h1>Sign In</h1>
        </form>
    )
}; 
