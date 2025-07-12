import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import "../styles/Auth.css"

const initialErrors = { name: "", email: "", password: "", confirmPassword: "" }

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState(initialErrors)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // Validation helpers
  const validate = () => {
    let valid = true
    const newErrors = { ...initialErrors }

    // Name: required, full name (at least 2 words)
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    } else if (formData.name.trim().split(" ").length < 2) {
      newErrors.name = "Please enter your full name"
      valid = false
    }

    // Email: required, valid format
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      valid = false
    }

    // Password: required, min 8, upper, lower, number, special
    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      valid = false
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must include a lowercase letter"
      valid = false
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must include an uppercase letter"
      valid = false
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must include a number"
      valid = false
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(formData.password)) {
      newErrors.password = "Password must include a special character"
      valid = false
    }

    // Confirm password: required, matches password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      valid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess("")
    if (!validate()) return
    setLoading(true)
    // Supabase signup
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { name: formData.name } }
    })
    if (error) {
      setLoading(false)
      setErrors({ ...initialErrors, email: error.message })
      return
    }
    // Auto-login after signup
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })
    setLoading(false)
    if (loginError) {
      setErrors({ ...initialErrors, email: loginError.message })
      return
    }
    setSuccess("You are registered successfully. Welcome!")
    setFormData({ name: "", email: "", password: "", confirmPassword: "" })
    setTimeout(() => {
      setSuccess("")
      navigate("/")
      window.location.reload()
    }, 3000)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        {success && <div className="auth-success" style={{ color: 'green', fontWeight: 600, fontSize: '1rem', marginBottom: '10px' }}>{success}</div>}
        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="form-input"
              autoComplete="off"
            />
            {errors.name && <div className="auth-error compact-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="form-input"
              autoComplete="off"
            />
            {errors.email && <div className="auth-error compact-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="form-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                tabIndex="-1"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.password && <div className="auth-error compact-error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="form-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                tabIndex="-1"
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.confirmPassword && <div className="auth-error compact-error">{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already a user? <Link to="/login" className="auth-link">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup 