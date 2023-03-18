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
  let ret;
  if (level === 1)
    ret = "https://source.unsplash.com/random/300x300/?desert?branch";
  else if (level === 2)
    ret = "https://source.unsplash.com/random/300x300/?dry";
  else if (level === 3)
    ret = "https://source.unsplash.com/random/300x300/?tree";
  else if (level === 4)
    ret = "https://source.unsplash.com/random/300x300/?fine";
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
    setEmail(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const evaluationData = {
      email: formData.get('email'),
      rating: formData.get('rating'),
      date: new Date(),
    };
    // TODO: Send evaluationData to backend API
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
                    alt="random"
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
                      {"level: " + weatherInfo[1].level}
                    </Typography>
                    <Typography>
                      {"count: " + weatherInfo[1].count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{"Enter your evaluation"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleFormSubmit}>
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