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

const theme = createTheme();

function Copyright() {
  return (
    <Typography variant="body2" color="white" align="center">
      {''}
      Coalition Hackathon 2023 -
      {' '}
      <Link 
        color="inherit" 
        href="https://github.com/42seoul-coalition-hackathon-2023/NICEWEATHER" 
        target="_blank" 
        rel="noopener"
      >
        NICE WEATHER
      </Link>
      {''}
    </Typography>
  );
}

// eslint-disable-next-line
function modifyWeatherInfosSunny(weatherInfos) {
  for (let key in weatherInfos) {
    // console.log(weatherInfos[key][1].date);
    // console.log(typeof(key));
    // eslint-disable-next-line
    if (key == 0) {
      weatherInfos[key][1].date = new Date(2023, 3, 19, 14);
      weatherInfos[key][1].count = 92;
      weatherInfos[key][1].level = 3;
    } // eslint-disable-next-line
    else if (key == 1) {
      weatherInfos[key][1].date = new Date(2023, 3, 19, 15);
      weatherInfos[key][1].count = 109;
      weatherInfos[key][1].level = 4;
    } // eslint-disable-next-line
    else if (key == 2) {
      weatherInfos[key][1].date = new Date(2023, 3, 19, 16);
      weatherInfos[key][1].count = 96;
      weatherInfos[key][1].level = 3;
    } // eslint-disable-next-line
    else if (key == 3) {
      weatherInfos[key][1].date = new Date(2023, 3, 19, 17);
      weatherInfos[key][1].count = 113;
      weatherInfos[key][1].level = 4;
    } // eslint-disable-next-line
    else if (key == 4) {
      weatherInfos[key][1].date = new Date(2023, 3, 19, 18);
      weatherInfos[key][1].count = 125;
      weatherInfos[key][1].level = 4;
    } // eslint-disable-next-line
    else if (key == 5) {
      weatherInfos[key][1].date = new Date(2023, 3, 19, 19);
      weatherInfos[key][1].count = 89;
      weatherInfos[key][1].level = 3;
    }
    else {
      weatherInfos[key][1].count = 90;
      weatherInfos[key][1].level = 3;
    }
    // weatherInfos[key][1].count = 100;
    // weatherInfos[key][1].level = 4;
  }
}

// eslint-disable-next-line
function modifyWeatherInfosEvenly(weatherInfos) {
  for (let key in weatherInfos) {
    // console.log(weatherInfos[key][1].date);
    // eslint-disable-next-line
    if (key == 0) {
      weatherInfos[key][1].count = 10;
      weatherInfos[key][1].level = 1;
    } // eslint-disable-next-line
    else if (key == 1) {
      weatherInfos[key][1].count = 39;
      weatherInfos[key][1].level = 2;
    } // eslint-disable-next-line
    else if (key == 2) {
      weatherInfos[key][1].count = 99;
      weatherInfos[key][1].level = 3;
    } // eslint-disable-next-line
    else if (key == 3) {
      weatherInfos[key][1].count = 200;
      weatherInfos[key][1].level = 4;
    } // eslint-disable-next-line
    else if (key == 4) {
      weatherInfos[key][1].count = 25;
      weatherInfos[key][1].level = 1;
    } // eslint-disable-next-line
    else if (key == 5) {
      weatherInfos[key][1].count = 59;
      weatherInfos[key][1].level = 2;
    }
    else {
      weatherInfos[key][1].count = 99;
      weatherInfos[key][1].level = 3;
    }
  }
}

function getBackgroundGifByAverageLevel(weathers) {
  let avg = 0;
  for (let key in weathers) {
    avg += weathers[key].count;
  }
  avg /= Object.keys(weathers).length;
  // Lv1 미만 30 Lv2 미만 60 Lv3 미만 100 Lv4
  let ret_bg;
  if (avg < 30)
    ret_bg = `background_level1_thunder.gif`;
  else if (avg < 60)
    ret_bg = `background_level2_rain.gif`;
  else if (avg < 100)
    ret_bg = `background_level3_pleasant.gif`;
  else
    ret_bg = `background_level4_sunny.gif`;
  return (ret_bg);
}

function getWeatherPhotoByLevel(level) {
  let ret_weather_photo = `/`;
  if (level === 1)
    ret_weather_photo += `weather_thunder.png`;
  else if (level === 2)
    ret_weather_photo += `weather_rain.png`;
  else if (level === 3)
    ret_weather_photo += `weather_cloud_sunny.png`;
  else if (level === 4)
    ret_weather_photo += `weather_sunny.png`;
  return ret_weather_photo;
}

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
  // console.log(weatherInfos);

  /* TEST */
  // modifyWeatherInfosSunny(weatherInfos);
  // modifyWeatherInfosEvenly(weatherInfos);

  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedWeatherInfo, setSelectedWeatherInfo] = useState(null);
  const handleCardItemClick = (weatherInfo) => {
    setErrorMessage('');
    setSelectedWeatherInfo(weatherInfo);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [email, setEmail] = useState('');
  const handleEmailChange = (event) => {
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
      console.log("responseOfPost:", responseOfPost);
      handleCloseDialog();
    } catch (error) {
      if (error.response) {
        // Handle error response
        // console.log('Error status code:', error.response.status);
        // console.log('Error message:', error.response.data);
        setErrorMessage(error.response.data.message);
      } else if (error.request) {
        // Handle no response error
        console.log('No response received:', error.request);
        setErrorMessage('No response');
      } else {
        // Handle other errors
        // console.log('Error occurred:', error.message);
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}> 
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: `url(/${getBackgroundGifByAverageLevel(weathers)})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          minHeight: '100vh',
        }}
      >
      <main>
        <Box
          sx={{
            pt: 8,
            pb: 0,
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
              42SEOUL EMA
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="xl">
          <Grid container spacing={2}>
            {weatherInfos.map((weatherInfo) => (
              <Grid
                item key={weatherInfo[0]}
                xs={12} sm={2} md={2}
              >
                <Card
                  onClick={() => handleCardItemClick(weatherInfo)}
                  sx={{ height: '100%', display: 'flex', 
                        flexDirection: 'column', cursor: 'pointer' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      backgroundColor: weatherInfo[1].level >= 3 ? 'skyblue' : 'black',
                      pt: '10%',
                      pb: '10%',
                    }}
                    image={getWeatherPhotoByLevel(weatherInfo[1].level)}
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
        <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ style: { minWidth: "350px", maxWidth: "350px" } }}>
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
              {errorMessage && (
                <Typography color="error" variant="body1" align="center">
                  {errorMessage}
                </Typography>
              )}
              <Button variant="contained" color="primary" type="submit" fullWidth>
                신청
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
          bgcolor: 'black',
          p: 3,
        }} 
          component="footer">
          <Typography
            variant="subtitle1"
            align="center"
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
