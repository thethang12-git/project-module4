import axios from "axios";

class UserService {
    static async getData() {
        return await axios.get("http://localhost:3001/users")
    }
}
export default UserService;