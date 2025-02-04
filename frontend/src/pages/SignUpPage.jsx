import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader, Lock, Mail, User, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
  const loading = false;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup } = useUserStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one number, one uppercase letter, one lowercase letter, one special character";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      signup(formData);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <motion.div
          className="sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
            Create your account
          </h2>
        </motion.div>
        <motion.div
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-gray-800 px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <FormInput
                label={"Full name"}
                name={"name"}
                type={"text"}
                value={formData.name}
                onChange={handleInputChange}
                placeholder={"Your name"}
                icon={User}
                error={errors.name}
              />

              <FormInput
                label={"Email address"}
                name={"email"}
                type={"email"}
                value={formData.email}
                onChange={handleInputChange}
                placeholder={"Your email address"}
                icon={Mail}
                error={errors.email}
              />

              <FormInput
                label={"Password"}
                name={"password"}
                type={"password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder={"Password"}
                icon={Lock}
                error={errors.password}
              />

              <FormInput
                label={"Confirm Password"}
                name={"confirmPassword"}
                type={"password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder={"Confirm Password"}
                icon={Lock}
                error={errors.confirmPassword}
              />

              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader
                      className="mr-2 h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                    Loading...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                    Sign up
                  </>
                )}
              </button>
            </form>
            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-emerald-400 hover:text-emerald-300"
              >
                Log in here <ArrowRight className="inline h-4 w-4" />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SignUpPage;
