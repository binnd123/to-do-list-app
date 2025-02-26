import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signup } from "../api/authApi";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const signupRequest = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
    };
    try {
      const response = await signup(signupRequest);
      if (response.businessCode === 2001) {
        setError("Tạo tài khoản thành công!");
      } else if (response.businessCode === 2003) {
        setError("Email đã tồn tại!");
      } else setError("Lỗi đăng ký!");
      navigate("/"); // Điều hướng đến trang đăng nhập sau khi đăng ký thành công
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Đăng ký
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Họ"
          variant="outlined"
          fullWidth
          margin="normal"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label="Tên"
          variant="outlined"
          fullWidth
          margin="normal"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
        >
          Đăng ký
        </Button>
        <Typography variant="body2" mt={2}>
          Đã có tài khoản?{" "}
          <Button onClick={() => navigate("/")}>Đăng nhập</Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
