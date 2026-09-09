import { useState } from "react";
import { apiFetch } from "../api";
import { useLoaderData, useActionData, redirect } from "react-router-dom";
import { useEffect } from "react";
// import axios from "axios";
export async function loginLoader() {
  return apiFetch("auth/register", { method: "GET" });
}
// Brand tokens — move into tailwind.config.js as named colors
// (navy, gold, cream) once this lives in the real Vite project.
const COLORS = {
  navy: "#1B2A4A",
  gold: "#C9A34E",
  cream: "#FDF6D8",
  pill: "#EDE0A0",
};

// Scattered background pills — purely decorative, echoes real course
// codes rather than generic shapes. Position/rotation/color chosen by
// hand for balance; swap codes if you want different ones featured.
const SCATTER_PILLS = [
  { code: "PHY 101", top: "30px", left: "36px", rotate: -8, dark: true },
  { code: "CHM 102", top: "80px", right: "50px", rotate: 6, dark: false },
  { code: "ECO 201", bottom: "210px", left: "24px", rotate: -10, dark: false },
  { code: "MTH 202", top: "190px", right: "20px", rotate: 9, dark: true },
  { code: "GST 101", bottom: "70px", left: "60px", rotate: 5, dark: true },
  { code: "CSC 201", bottom: "120px", right: "44px", rotate: -5, dark: false },
  { code: "STA 111", top: "330px", left: "8px", rotate: 7, dark: false },
  { code: "ACC 201", top: "350px", right: "6px", rotate: -6, dark: true },
];

// Placeholder options — real lists should come from the backend
// (supported universities table; faculty/department may be a
// dependent dropdown chain off the chosen university).

const FACULTIES = ["Computing", "Engineering", "Sciences"];
const DEPARTMENTS = [
  "Software Engineering",
  "Computer Science",
  "Information Technology",
];
const LEVELS = ["100", "200", "300", "400", "500"];

function ScatterPill({ code, top, left, right, bottom, rotate, dark }) {
  return (
    <span
      className="absolute text-xs font-medium px-3 py-1.5 rounded-full pointer-events-none select-none"
      style={{
        top,
        left,
        right,
        bottom,
        transform: `rotate(${rotate}deg)`,
        background: dark ? COLORS.navy : COLORS.pill,
        color: dark ? COLORS.cream : COLORS.navy,
      }}
    >
      {code}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const loaderData = useLoaderData();

  const [universities, setUniversities] = useState([]);
  const [universitiesLoading, setUniversitiesLoading] = useState(true);

  useEffect(() => {
    async function loadUniversities() {
      try {
        const data = await apiFetch("auth/register", { method: "GET" });
        setUniversities(data.universities);
        console(universities);
      } catch (err) {
        console.error("Failed to load universities", err);
      } finally {
        setUniversitiesLoading(false);
      }
      return apiFetch("auth/register", { method: "GET" });
    }
    loadUniversities();
  }, []);

  //we declared register Forms and login forms as use states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    email: "",
    university_id: "",
    faculty: "",
    department: "",
    level: "",
    password: "",
    confirm_password: "",
  });
  //How to get the errors from a react component and render them.

  async function handleLoginSubmit(e) {
    e.preventDefault();
    // Wire up with apiFetch("auth/login", { method: "POST", body: loginForm })
    // once the visual shell is approved.
    console.log("login submit", loginForm);
    console.log(apiFetch("/auth/login", { method: "POST", body: loginForm }));
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    // Wire up with apiFetch("auth/register", { method: "POST", body: registerForm })
    // once the visual shell is approved.
    console.log("register submit", registerForm);
    const info = await apiFetch("/auth/register", {
      method: "POST",
      body: registerForm,
    });
    console.log(info);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: COLORS.cream }}
    >
      {SCATTER_PILLS.map((pill, i) => (
        <ScatterPill key={i} {...pill} />
      ))}

      <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 px-8 pt-8 pb-7">
        <p
          className="text-sm font-medium mb-6"
          style={{ color: COLORS.navy, letterSpacing: "0.2px" }}
        >
          Priority Tutor
        </p>

        <div className="flex gap-6 border-b border-gray-200 mb-5">
          <button
            type="button"
            onClick={() => setTab("login")}
            className="pb-2.5 text-xl font-medium"
            style={{
              color: tab === "login" ? COLORS.navy : "#9CA3AF",
              borderBottom:
                tab === "login"
                  ? `2px solid ${COLORS.navy}`
                  : "2px solid transparent",
            }}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setTab("register")}
            className="pb-2.5 text-xl font-medium"
            style={{
              color: tab === "register" ? COLORS.navy : "#9CA3AF",
              borderBottom:
                tab === "register"
                  ? `2px solid ${COLORS.navy}`
                  : "2px solid transparent",
            }}
          >
            Register
          </button>
        </div>

        {tab === "login" ? (
          <form onSubmit={handleLoginSubmit}>
            <Field label="Email">
              <input
                type="email"
                placeholder="name@university.edu.ng"
                className={inputClass}
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                placeholder="Enter your password"
                className={inputClass}
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />
            </Field>

            <p className="text-right mb-4">
              <a
                href="#"
                className="text-xs font-medium"
                style={{ color: COLORS.gold }}
              >
                Forgot password?
              </a>
            </p>

            <button
              type="submit"
              className="w-full h-10 rounded-lg text-sm font-medium"
              style={{ background: COLORS.navy, color: COLORS.cream }}
            >
              Sign in
            </button>

            <p className="text-sm text-gray-500 text-center mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setTab("register")}
                className="font-medium"
                style={{ color: COLORS.gold }}
              >
                Register for free
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <Field label="Full name">
              <input
                type="text"
                placeholder="Chidinma Okafor"
                className={inputClass}
                value={registerForm.full_name}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    full_name: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                placeholder="name@university.edu.ng"
                className={inputClass}
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
              />
            </Field>
            <Field label="University">
              <select
                className={inputClass}
                value={registerForm.university_id}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    university_id: e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  {universitiesLoading
                    ? "Loading..."
                    : "Select your university"}
                </option>
                {universities.map((u) => (
                  <option key={u.university_id} value={u.university_id}>
                    {u.university_name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Faculty">
                <select
                  className={inputClass}
                  value={registerForm.faculty}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      faculty: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {FACULTIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Department">
                <select
                  className={inputClass}
                  value={registerForm.department}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      department: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Level">
              <select
                className={inputClass}
                value={registerForm.level}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, level: e.target.value })
                }
              >
                <option value="" disabled>
                  Select
                </option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3 mb-1">
              <Field label="Password">
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  className={inputClass}
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Confirm">
                <input
                  type="password"
                  placeholder="Re-enter password"
                  className={inputClass}
                  value={registerForm.confirm_password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      confirm_password: e.target.value,
                    })
                  }
                />
              </Field>
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-lg text-sm font-medium mt-4"
              style={{ background: COLORS.navy, color: COLORS.cream }}
            >
              Create account
            </button>

            <p className="text-sm text-gray-500 text-center mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setTab("login")}
                className="font-medium"
                style={{ color: COLORS.gold }}
              >
                Log in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
