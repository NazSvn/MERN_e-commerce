import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader, Lock, Mail, User, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useUserStore } from "../stores/useUserStore";
import handleSimpleKeydown from "../utils/handleSimpleKeydown";

const SignUpPage = () => {
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

  const { signup, loading } = useUserStore();

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const refs = useMemo(
    () => ({
      name: nameRef,
      email: emailRef,
      password: passwordRef,
      confirmPassword: confirmPasswordRef,
    }),
    [],
  );

  const emailRegex = useMemo(
    () => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    [],
  );

  const passwordRegex = useMemo(
    () => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
    [],
  );

  const validateForm = useCallback(() => {
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

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
  }, [
    emailRegex,
    formData.confirmPassword,
    formData.email,
    formData.name,
    formData.password,
    passwordRegex,
  ]);

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
        await signup(formData);
      }
    },
    [formData, signup, validateForm],
  );

  const inputsConfig = useMemo(
    () => [
      {
        label: "Full name",
        name: "name",
        type: "text",
        placeholder: "Your name",
        icon: User,
        ref: refs.name,
      },
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
      {
        label: "Confirm Password",
        name: "confirmPassword",
        type: "password",
        placeholder: "Confirm Password",
        icon: Lock,
        ref: refs.confirmPassword,
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
            Create your account
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
