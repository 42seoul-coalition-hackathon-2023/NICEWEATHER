import React, {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from '@mui/material';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function getPhotoLinkByLevel(level) {
  level = 4;
  let ret;
  // if (level === 1)
  //   ret = "https://source.unsplash.com/random/300x300/?desert?branch";
  // else if (level === 2)
  //   ret = "https://source.unsplash.com/random/300x300/?dry";
  // else if (level === 3)
  //   ret = "https://source.unsplash.com/random/300x300/?tree";
  // else if (level === 4)
  //   ret = "https://source.unsplash.com/random/300x300/?fine";
  
  ret = `/`;
  if (level === 1)
    ret += `drought.jpeg`;
  else if (level === 2)
  ret += `sprout.jpeg`;
  else if (level === 3)
    ret += `little_tree.jpeg`;
  else if (level === 4)
    ret += `tree.jpeg`;
  // console.log(`ret: ${ret}`);
  return ret;
}

// const cards = [1, 2, 3, 4, 5, 6];

const theme = createTheme();

export default function EvaluationWeather() {
  const [weathers, SetWeathers] = useState([]);

  const fetchData = async () => {
    const response = await axios.get('http://localhost:4000/main/')
    SetWeathers(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const weatherInfos = Object.entries(weathers);
  console.log(weatherInfos);


  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWeatherInfo, setSelectedWeatherInfo] = useState(null);

  const handleGridItemClick = (weatherInfo) => {
    setSelectedWeatherInfo(weatherInfo);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    console.log("event.target.value: ", event.target.value);
    setEmail(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // console.log(event);
    // const formData = new FormData(event.target);

    // const email = formData.get('email');
    // const rating = formData.get('rating');
    // const date = new Date();
    
    // console.log('email:', email); // check that email is being retrieved correctly
    // console.log('rating:', rating); // check that rating is being retrieved correctly
    
    // const evaluationData = { email, rating};
    // console.log('rating:', rating); // check that rating is being retrieved correctly
    
    const reservationData = {
      time: new Date(selectedWeatherInfo?.[1]?.date),
      mail: email,
    };
    const responseOfPost = await axios.post('http://localhost:4000/main/', reservationData);
    console.log("responseOfPost:", responseOfPost);
    handleCloseDialog();
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 0,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              NICE WEATHER
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              42seoul Evaluation Meteorological Administration
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="xl">
          {/* End hero unit */}
          <Grid container spacing={2}>
            {weatherInfos.map((weatherInfo) => (
              <Grid item key={weatherInfo[0]} xs={12} sm={2} md={2}
              onClick={() => handleGridItemClick(weatherInfo)}
              sx={{ cursor: 'pointer' }}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      // 16:9
                      //pt: '56.25%',
                    }}
                    image={
                        getPhotoLinkByLevel(weatherInfo[1].level)
                      }
                    alt="weather image"
                    // alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {
                        new Date(weatherInfo[1].date).getMonth() + 1 + "월 " + 
                        new Date(weatherInfo[1].date).getDate() + "일 " + 
                        new Date(weatherInfo[1].date).getHours() + "시"
                      }
                    </Typography>
                    {/* <Typography>
                      {"level: " + weatherInfo[1].level}
                    </Typography> */}
                    <Typography>
                      {"평가 지수: " + weatherInfo[1].count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{"평가 알림 신청"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleFormSubmit}>
              <Typography variant="subtitle1" gutterBottom>
                {"Selected time: " +
                  new Date(selectedWeatherInfo?.[1]?.date).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour12: false,
                    hour: 'numeric',
                    timeZone: 'Asia/Seoul',
                  })
                  }
              </Typography>
              <TextField
                label="Your email"
                fullWidth
                margin="normal"
                value={email}
                onChange={handleEmailChange}
              />
              {/* <TextField label="Your name" fullWidth margin="normal" /> */}
              {/* <TextField label="Evaluation" fullWidth margin="normal" /> */}
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}