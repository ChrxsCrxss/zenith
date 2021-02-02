import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import style from "./auth.module.css";

export default () => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { doRequest, errors } = useRequest({
        url: "/api/users/signup",
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
        <div className={style.background}>
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
                    <button className="btn-primary">Sign Up</button>
                </div>
                <h1>Sign Up</h1>
            </form>
        </div>

    )
}; 