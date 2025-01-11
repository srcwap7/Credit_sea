import * as React from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  IconButton,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider, SignInPage } from '@toolpad/core';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';


const providers = [{ id: 'credentials', name: 'Email and Password'}];


function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Username"
      name="email"
      type="email"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  );
}

function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        Password
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

function CustomButton() {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      Sign In
    </Button>
  );
}

function SignUpLink() {
  return (
    <Link href="/signup" variant="body2">
      Sign up
    </Link>
  );
}


function ForgotPasswordLink() {
  return (
    <Link href="/" variant="body2">
      Forgot password?
    </Link>
  );
}

export default function SlotsSignIn() {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSignIn = async(formData)=>{
    const email = formData.get("email");
    const password = formData.get("password");
    
    const response = await fetch("http://localhost:5000/login",{
      method: 'POST',
      headers:{ 'Content-Type': 'application/json' },
      body: JSON.stringify({email:email,password:password}),
    });

    if (response.ok){
      console.log("Request Successfull");
      const data=await response.json();
      console.log(data);
      const userId = data.userId;
      navigate(`/homepage?user=${userId}`);
    }

    else {
      alert("Invalid Credentials");
      console.log("Request Failed!");
    }
  }


  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px',padding:'20px',justifyContent:'center',alignItems:'center'}}>
      <AppProvider theme={theme}>
        <SignInPage
          signIn={(provider, formData) =>
            handleSignIn(formData)
          }
          slots={{
            emailField: CustomEmailField,
            passwordField: CustomPasswordField,
            submitButton: CustomButton,
            signUpLink: SignUpLink,
            forgotPasswordLink: ForgotPasswordLink,
          }}
          providers={providers}
        />
      </AppProvider>

      OR 

      <Button
        variant="contained"
        color="primary"
        startIcon={<LoginIcon />} // Optional icon on the left side
        sx={{
          textTransform: 'none', // Disable uppercase text
          fontSize: '18px',
          padding: '10px 20px',
          borderRadius: '8px',
          backgroundColor: '#1976d2', // Custom color
          '&:hover': {
            backgroundColor: '#1565c0', // Darker shade on hover
          },
          boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)', // Shadow effect
        }}
        onClick={()=>{
          navigate("/verifiersignin");
        }}
      >
      Sign In As Verifier
      </Button>

      OR

      <Button
        variant="contained"
        color="primary"
        startIcon={<LoginIcon />} // Optional icon on the left side
        sx={{
          textTransform: 'none', // Disable uppercase text
          fontSize: '18px',
          padding: '10px 20px',
          borderRadius: '8px',
          backgroundColor: '#1976d2', // Custom color
          '&:hover': {
            backgroundColor: '#1565c0', // Darker shade on hover
          },
          boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)', // Shadow effect
        }}
        onClick={()=>{
          navigate("/adminsignin");
        }}
      >
      Sign In As Admin
      </Button>
    </div>
  );
}
