import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);



export default function NewCard({name, year, ctype , damount}) {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card style={{padding:"20px"}} variant="outlined">
      <React.Fragment>
    <CardContent>
      <Typography sx={{ mb: 1.5 }} variant="h5" component="div">
      {name} is requesting for Data
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
      
       Year : {year}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        Company Type : {ctype}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
       Number of Data : {damount}
      </Typography>
    </CardContent>
   
    <div style={{display:"flex" , justifyContent:"space-around"}} className="footerbutton">
        <button className="btn btn-primary d-none d-sm-inline-block">
            Accept
        </button>
        <button className="btn btn-primary d-none d-sm-inline-block">
            Assign Manually
        </button>
    </div>
   
    

  </React.Fragment>
      </Card>
    </Box>
  );
}