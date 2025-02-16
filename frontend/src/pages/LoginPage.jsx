import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import FormInput from "../components/FormInput";
import { ArrowRight, Loader, Lock, Mail, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import handleSimpleKeydown from "../utils/handleSimpleKeydown";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const refs = useMemo(
    () => ({
      email: emailRef,
      password: passwordRef,
    }),
    [],
  );

  const { login, loading } = useUserStore();

  const emailRegex = useMemo(
    () => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    [],
  );

  const validateForm = useCallback(() => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  }, [emailRegex, formData.email, formData.password]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (validateForm()) {
        await login(formData.email, formData.password);
      }
    },
    [formData.email, formData.password, login, validateForm],
  );

  const inputsConfig = useMemo(
    () => [
      {
        label: "Email address",
        name: "email",
        type: "email",
        placeholder: "Your email address",
        icon: Mail,
        ref: refs.email,
      },
      {
        label: "Password",
        name: "password",
        type: "password",
        placeholder: "Password",
        icon: Lock,
        ref: refs.password,
      },
    ],
    [refs],
  );

  return (
    <>
      <div className="mx-4 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <motion.div
          className="sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
            Log in
          </h2>
        </motion.div>
        <motion.div
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gray-800 px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {inputsConfig.map((input) => (
                <FormInput
                  key={input.name}
                  {...input}
                  value={formData[input.name]}
                  onChange={handleInputChange}
                  onKeyDown={(e) =>
                    handleSimpleKeydown(e, setFormData, input.name, input.ref)
                  }
                  error={errors[input.name]}
                />
              ))}
              <button
                type="submit"
                className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
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
                    Log in
                  </>
                )}
              </button>
            </form>
            <p className="mt-8 text-center text-sm text-gray-400">
              Do not have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-emerald-400 hover:text-emerald-300"
              >
                Sign up here <ArrowRight className="inline h-4 w-4" />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
