import { api } from "./config";

export default {

  auth: (authenticate) => {
    console.log(authenticate);
    return api.post('/auth/login', authenticate)
  }

}
