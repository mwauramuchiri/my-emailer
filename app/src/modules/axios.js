import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_APP_URL;

export default axios;