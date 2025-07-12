import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import "../styles/Auth.css"

const initialErrors = { email: "", password: "" }

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState(initialErrors)
  const [showPassword, setShowPassword] = useState(false)
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

  const validate = () => {
    let valid = true
    const newErrors = { ...initialErrors }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      valid = false
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
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
    // Try login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })
    setLoading(false)
    if (error && error.message.toLowerCase().includes("invalid login credentials")) {
      setErrors({ ...initialErrors, password: "Invalid email or password" })
      return
    }
    if (error) {
      setErrors({ ...initialErrors, email: error.message })
      return
    }
    setSuccess("User logged in successfully!")
    setFormData({ email: "", password: "" })
    setTimeout(() => {
      setSuccess("")
      navigate("/")
      window.location.reload()
    }, 3000)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        {success && <div className="auth-success" style={{ color: 'green', fontWeight: 600, fontSize: '1rem', marginBottom: '10px' }}>{success}</div>}
        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
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
                autoComplete="current-password"
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

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            New user? <Link to="/signup" className="auth-link">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login 