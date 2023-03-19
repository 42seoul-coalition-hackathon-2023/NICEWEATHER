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

function getBackgroundGifByAverageLevel(weathers) {
  let sum = 0;
  for (let key in weathers) {
    sum += weathers[key].count;
  }
  let avg = sum / Object.keys(weathers).length;
  // console.log(`avg: ${avg}`);

  // avg = 31;

  let ret;
  // Lv1 미만 30 Lv2 미만 60 Lv3 미만 100 Lv4
  if (avg < 30)
    ret = `background_thunder.gif`;
  else if (avg < 60)
    ret = `background_rain1.gif`;
  else if (avg < 100)
    ret = `b34.gif`;
  else
    ret = `background_sunny.gif`;
  return (ret);
}

function Copyright() {
  return (
    <Typography variant="body2" color="white" align="center">
      {''}
      <Link color="inherit" href="https://github.com/42seoul-coalition-hackathon-2023/NICEWEATHER" target="_blank" rel="noopener">
        NICE WEATHER
      </Link>{' '}
      - 42Seoul Coalition Hackathon 2023
      {'.'}
    </Typography>
  );
}

function getPhotoLinkByLevel(level) {
  let ret = `/`;

  if (level === 1)
    ret += `thunder22.png`;
  else if (level === 2)
    ret += `rain22.png`;
  else if (level === 3)
    ret += `cloud sunny22.png`;
  else if (level === 4)
    ret += `sunny22.png`;
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

  // Lv1 미만 30 Lv2 미만 60 Lv3 미만 100 Lv4

  // for (let key in weatherInfos) {
  //   console.log(weatherInfos[key][1].date);
  //   if (key == 0) {
  //     weatherInfos[key][1].count = 92;
  //     weatherInfos[key][1].level = 3;
  //   }
  //   else if (key == 1) {
  //     weatherInfos[key][1].count = 109;
  //     weatherInfos[key][1].level = 4;
  //   }
  //   else if (key == 2) {
  //     weatherInfos[key][1].count = 96;
  //     weatherInfos[key][1].level = 3;
  //   }
  //   else if (key == 3) {
  //     weatherInfos[key][1].count = 113;
  //     weatherInfos[key][1].level = 4;
  //   }
  //   else if (key == 4) {
  //     weatherInfos[key][1].count = 125;
  //     weatherInfos[key][1].level = 4;
  //   }
  //   else if (key == 5) {
  //     weatherInfos[key][1].count = 89;
  //     weatherInfos[key][1].level = 3;
  //   }
  //   else {
  //     weatherInfos[key][1].count = 90;
  //     weatherInfos[key][1].level = 3;
  //   }

  //   // weatherInfos[key][1].count = 100;
  //   // weatherInfos[key][1].level = 4;
  // }

  // for (let key in weatherInfos) {
  //   console.log(weatherInfos[key][1].date);
  //   if (key == 0) {
  //     weatherInfos[key][1].count = 10;
  //     weatherInfos[key][1].level = 1;
  //   }
  //   else if (key == 1) {
  //     weatherInfos[key][1].count = 39;
  //     weatherInfos[key][1].level = 2;
  //   }
  //   else if (key == 2) {
  //     weatherInfos[key][1].count = 99;
  //     weatherInfos[key][1].level = 3;
  //   }
  //   else if (key == 3) {
  //     weatherInfos[key][1].count = 200;
  //     weatherInfos[key][1].level = 4;
  //   }
  //   else if (key == 4) {
  //     weatherInfos[key][1].count = 25;
  //     weatherInfos[key][1].level = 1;
  //   }
  //   else if (key == 5) {
  //     weatherInfos[key][1].count = 59;
  //     weatherInfos[key][1].level = 2;
  //   }
  //   else {
  //     weatherInfos[key][1].count = 99;
  //     weatherInfos[key][1].level = 3;
  //   }

  //   // weatherInfos[key][1].count = 100;
  //   // weatherInfos[key][1].level = 4;
  // }


  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedWeatherInfo, setSelectedWeatherInfo] = useState(null);

  const handleGridItemClick = (weatherInfo) => {
    setErrorMessage('');
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
    const reservationData = {
      time: selectedWeatherInfo?.[1]?.date,
      mail: email,
    };
    try {
      const responseOfPost = await axios.post('http://localhost:4000/main/', reservationData);
      // Handle successful response
      console.log("responseOfPost:", responseOfPost);
      handleCloseDialog();
    } catch (error) {
      
      if (error.response) {
        console.log('Error status code:', error.response.status);
        console.log('Error message:', error.response.data);
        setErrorMessage(error.response.data.message);
        // Handle error response
      } else if (error.request) {
        console.log('No response received:', error.request);
        // Handle no response error
      } else {
        console.log('Error occurred:', error.message);
        // Handle other errors
      }
    }
  };

  return (
    <ThemeProvider theme={theme}> 
      <CssBaseline />
        <Box
        sx={{
          // backgroundImage: `url(/etienne-girardet-sPAY2trdWzg-unsplash.jpeg)`,
          backgroundImage: `url(/${getBackgroundGifByAverageLevel(weathers)})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          minHeight: '100vh',
          zIndex: 1,
        }}
      >
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            // bgcolor: 'background.paper', // 이거 지우니까 기존에 백그라운그 이미지를 가렸던게 없어졌다.
            pt: 8,
            pb: 0,
            // backgroundImage: `url(/tree.jpeg)`,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h4"
              align="center"
              color="text.primary"
              gutterBottom
              style={{ fontSize: '40px' }}
            >
              NICE WEATHER
            </Typography>
            <Typography variant="h4" align="center" color="text.secondary" paragraph>
              42Seoul EMA
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
                      backgroundColor: weatherInfo[1].level >= 3 ? 'skyblue' : 'black',
                      // 16:9
                      pt: '10%',
                      pb: '10%',
                      // pt: '20px',
                      // pb: '20px',
                      // height: '61.8%',
                    }}
                    image={
                        getPhotoLinkByLevel(weatherInfo[1].level)
                      }
                    alt="weather image"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {
                        new Date(weatherInfo[1].date).getMonth() + 1 + "월 " + 
                        new Date(weatherInfo[1].date).getDate() + "일 " + 
                        new Date(weatherInfo[1].date).getHours() + "시"
                      }
                    </Typography>
                    <Typography>
                      {"평가 지수: " + weatherInfo[1].count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Dialog open={openDialog} onClose={handleCloseDialog} minWidth="md" maxWidth="md">
          <DialogTitle>{"평가 알림 신청"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleFormSubmit}>
              <Typography variant="subtitle1" gutterBottom>
                {"선택 시간대: " +
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
                label="이메일"
                fullWidth
                margin="normal"
                value={email}
                onChange={handleEmailChange}
              />
              {/* <TextField label="Your name" fullWidth margin="normal" /> */}
              {/* <TextField label="Evaluation" fullWidth margin="normal" /> */}
              {errorMessage && (
                <Typography color="error" variant="body1" align="center">
                  {errorMessage}
                </Typography>
              )}
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      {/* Footer */}
      <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        bgcolor: 'black',//'background.paper', 
        p: 3,
        // backgroundImage: `url(/etienne-girardet-sPAY2trdWzg-unsplash.jpeg)`,
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
        // minHeight: '100vh',
        // zIndex: 1,
       }} 
        component="footer">
        {/* <Typography variant="h6" align="center" gutterBottom color='white'>
          NICE WEATHER
        </Typography> */}
        <Typography
          variant="subtitle1"
          align="center"
          // color="text.secondary"
          component="p"
          color="white"
        >
          42Seoul Evaluation Meteorological Administration
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
      </Box>  
    </ThemeProvider>
  );
}