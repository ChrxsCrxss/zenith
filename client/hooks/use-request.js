import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {

    const [errors, setErrors] = useState(null);
    const doRequest = async () => {

        try {
            setErrors(null);
            // You can look up the axios method !
            const response = await axios[method](url, body);
            // home screen if there are no errors. Functional
            // programming :)
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (err) {
            console.log(err);
            setErrors(
                <div className="alert alert-danger">
                    <h4>Oops...</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map(err => <li key={err.message}> {err.message}</li>)}
                    </ul>
                </div>
            )
        }

    }

    return { doRequest, errors };
}