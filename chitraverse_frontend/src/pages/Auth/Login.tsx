import {useState} from "react";
import { loginUser } from "../../api/auth";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullname: "",
    avatar: "",
    coverImage: ""
  });

  const {login, fetchUser} = useAuth();

  const navigate = useNavigate();

  const [error, setError] = useState<String|null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await loginUser(formData);
        login(formData);
        fetchUser();
        navigate("/home");
      } catch (err) {
        const error = err as { response: { data: { message: string } } };
        setError(error.response.data.message || "Something went wrong");
      }
    };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl text-center text-red-600 font-bold mb-4">
          Login Your Account
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="mb-2">
          <label className="text-red-600 text-sm p-1 font-bold">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-1 border rounded"
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-2">
          <label className="text-red-600 text-sm p-1 font-bold">
            Password:
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-1 border rounded"
            onChange={handleInputChange}
          />
        </div>

        <button
          type="submit"
          className="bg-red-500 text-white px-2 py-1 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};
export default Login;
