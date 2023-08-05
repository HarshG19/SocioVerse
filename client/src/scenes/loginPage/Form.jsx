import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import FlexBetween from "components/FlexBetween";
import FileBase from "react-file-base64"
import axios from "axios";





const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const [registerdata, setRegisterdata] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
  });

  const [logindata, setLogindata] = useState({
    email: "",
    password: ""
  });




  const register = async () => {
    try {
      const regres=await axios.post("http://localhost:3001/auth/register", {
          headers:{
            "content-type":"application/json",
          },
          body:
            registerdata
         });
  
      const savedUser = regres;
  
      console.log(savedUser);
      if (savedUser) {
        setPageType("login");
      }
    } catch (error) {
      console.log("Error during Phejesk:", error);
    }
  };
  




  const login = async () => {
    const loggedInResponse = await axios.post("http://localhost:3001/auth/login", {
      headers: { "Content-Type": "application/json" },
      body: logindata
    });
    const loggedIn = loggedInResponse;
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.data.user,
          token: loggedIn.data.token,
        })
      );
      navigate("/home");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) await login();
    if (isRegister) await register();
  };

  return (
    <>
      {
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onChange={(e) => setRegisterdata({ ...registerdata, firstName: e.target.value })}
                  value={registerdata.firstName}
                  name="firstName"
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onChange={(e) => setRegisterdata({ ...registerdata, lastName: e.target.value })}
                  value={registerdata.lastName}
                  name="lastName"
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onChange={(e) => setRegisterdata({ ...registerdata, location: e.target.value })}
                  value={registerdata.location}
                  name="location"
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onChange={(e) => setRegisterdata({ ...registerdata, occupation: e.target.value })}
                  value={registerdata.occupation}
                  name="occupation"
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) => setRegisterdata({ ...registerdata, picture: base64 })}
                  />

                </Box>

                <TextField
                  label="Email"
                  onChange={(e) => setRegisterdata({ ...registerdata, email: e.target.value })}
                  value={registerdata.email}
                  name="email"
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onChange={(e) => setRegisterdata({ ...registerdata, password: e.target.value })}
                  value={registerdata.password}
                  name="password"
                  sx={{ gridColumn: "span 4" }}
                />

              </>
            )}

            {isLogin && (
              <>
                <TextField
                  label="Email"
                  onChange={(e) => setLogindata({ ...logindata, email: e.target.value })}
                  value={logindata.email}
                  name="email"
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onChange={(e) => setLogindata({ ...logindata, password: e.target.value })}
                  value={logindata.password}
                  name="password"
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}

            {/* BUTTONS */}
            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {isLogin ? "LOGIN" : "REGISTER"}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign Up here."
                  : "Already have an account? Login here."}
              </Typography>
            </Box>
          </Box>
        </form>
      }
    </>
  );
};

export default Form;
