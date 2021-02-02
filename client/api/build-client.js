import axios from 'axios';


// Question: why do we connect to the load balancer over an insecure connection ? 
// We have to reach out to the api over a secure connection or we get a CORS error 
const INGRESS_NGINX_SRV = "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/";
const APP_BASE_URL = "https://zenith.io/";

// The purpose of this function is to return an axios instance
// appropriate to the current environment in which the request is made
export default ({ req }) => {
    // The window varible only exists on the broswer, 
    // so if its type is undefined, we know we are on 
    // the server, so requests need to routed via the
    // ingress-nginx controller 
    if (typeof window === "undefined") {
        return axios.create({
            baseURL: INGRESS_NGINX_SRV,
            // Essentially, we are grabbing the req object (destructured above) that was
            // passed as an object to the getInitialProps method. We want to pass these 
            // headers along to the ingress-nginx load balancer to preserve the cookie the
            // api generated when the user signed up or signed in. So now the client is 
            // essentially acting as ANOTHER proxy, since it reaches out to the ingress-nginx
            // controller, which then maps "api/users/currentuser" to the appropriate service. 
            // The strange thing about this is that the client (which within the cluster) is 
            // hitting the load balancer 'from the rear.'
            headers: req.headers
        });
    } else {
        // You are in a broswer, so can requests can directly
        // to the base url (i.e., the external IP of cluster)
        return axios.create({
            baseURL: APP_BASE_URL
        });
    }
}