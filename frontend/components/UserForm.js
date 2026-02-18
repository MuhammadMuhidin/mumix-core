export default function UserForm({ action }) {
const inputStyle = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontSize: 14,
  outline: "none",
};

const primaryButton = {
  padding: "12px",
  borderRadius: 10,
  border: "none",
  background: "#16a34a",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

  return (
    <form
      action={action}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <input
        name="name"
        placeholder="Full Name"
        required
        style={inputStyle}
      />

      <input
        name="email"
        placeholder="Email Address"
        required
        style={inputStyle}
      />

      <input
        name="phone"
        placeholder="Phone Number"
        required
        style={inputStyle}
      />

      <input
        name="password"
        placeholder="Password"
        type="password"
        required
        style={inputStyle}
      />

      <select name="role" defaultValue="user" style={inputStyle}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14,
        }}
      >
        <input type="checkbox" name="is_active" defaultChecked />
        Active
      </label>

      <button type="submit" style={primaryButton}>
        Create User
      </button>
    </form>
  );
}