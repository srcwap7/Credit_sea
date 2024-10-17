import * as React from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider, SignInPage } from '@toolpad/core';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';


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
    



export default function SlotsSignIn() {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSignIn = async(formData)=>{
    const email = formData.get("email");
    const password = formData.get("password");
    
    console.log(email);
    console.log(password);
    
    const response = await fetch("https://credit-sea.onrender.com/loginadmin",{
      method: 'POST',
      headers:{ 'Content-Type': 'application/json' },
      body: JSON.stringify({email:email,password:password}),
    });

    if (response.ok){
      console.log("Request Successfull");
      const data=await response.json();
      console.log(data);
      const userId = data.userId;
      navigate(`/adminhomepage?admin=${userId}`);
    }

    else {
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
          }}
          providers={providers}
        />
      </AppProvider>
    </div>
  );
}