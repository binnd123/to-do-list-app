import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { signin } from "../api/authApi";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedError = localStorage.getItem("loginError");

    if (storedError) {
      const { message, expires } = JSON.parse(storedError);

      if (Date.now() < expires) {
        setErrorMessage(message);
        setOpen(true);

        setTimeout(() => {
          setOpen(false);
          localStorage.removeItem("loginError");
        }, 5000);
      } else {
        localStorage.removeItem("loginError");
      }
    }
  }, []);

  const handleLogin = async () => {
    const signinRequest = {
      email: email,
      password: password,
    };
    try {
      const response = await signin(signinRequest);
      if (response.businessCode == 2007) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        navigate("/home");
      } else {
        setError("Email hoặc mật khẩu không chính xác!");
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpen(false)} severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>

      <Container maxWidth="xs">
        <Box mt={5} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Đăng nhập
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
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
            onClick={handleLogin}
          >
            Đăng nhập
          </Button>
          <Typography variant="body2" mt={2}>
            Chưa có tài khoản?{" "}
            <Button onClick={() => navigate("/register")}>Đăng ký</Button>
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Signin;
