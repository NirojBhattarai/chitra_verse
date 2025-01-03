import { useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../../api/auth.js";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    avatar: null,
    coverImage: null,
    password: "",
  });

  const [error, setError] = useState<String | null>(null);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    const newFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        newFormData.append(key, value);
      }
    });

    try {
      await registerUser(newFormData);
      navigate("/login");
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
          Create Your Account
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="mb-2">
          <label className="text-red-600 text-sm p-1 font-bold">
            User Name:
          </label>
          <input
            type="text"
            name="username"
            placeholder="User Name"
            className="w-full p-1 border rounded"
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-2">
          <label className="text-red-600 text-sm p-1 font-bold">
            Full Name:
          </label>
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            className="w-full p-1 border rounded"
            onChange={handleInputChange}
          />
        </div>

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
          <label className="text-red-600 text-sm p-1 font-bold">Avatar:</label>
          <input
            type="file"
            name="avatar"
            className="w-full p-1 border rounded"
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-2">
          <label className="text-red-600 text-sm p-1 font-bold">
            Cover Image:
          </label>
          <input
            type="file"
            name="coverImage"
            className="w-full p-1 border rounded"
            onChange={handleFileChange}
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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
