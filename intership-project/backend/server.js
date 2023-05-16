const express = require('express');
const app = express();
const bodyparser = require('body-parser')
const {MongoClient} = require('mongodb')
const cors = require('cors');
const { Image } = require('image-js');
const Vibrant = require('node-vibrant');


app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(cors());

app.post('/api/extractColors', async (req, res) => {
    const base64String = req.body.image;
    const buffer = Buffer.from(base64String, 'base64');
    const image = await Vibrant.from(buffer).getPalette();
    const colors = Object.values(image)
      .map((color) => color.getHex())
      .filter((color) => color !== undefined);
    let data=[];
    colors.map(color=>{
      data=([...data,{color:color,value:getColorValueFromHex(color)}])
    })
    console.log(data)
    res.send(data);
  });
  


app.post('/upload', async (req, res) => {
    const base64String = req.body.body;
    const buffer = Buffer.from(base64String, 'base64');
    const colorThief = new ColorThief();
    const [palette, dominantColor] = await Promise.all([
      colorThief.getPalette(buffer),
      colorThief.getColor(buffer),
    ]);
    const colors = Object.values(palette)
    console.log(palette,"pal")
    console.log(dominantColor,"dom")
    res.send({ palette, dominantColor });
  });
  

app.delete("/upload", (req, res) => {
    console.log(`File deleted`)
    return res.status(200).json({ result: true, msg: 'file deleted' });
});
function getColorValueFromHex(hexValue) {
  const red = parseInt(hexValue.substr(1, 2), 16);
  const green = parseInt(hexValue.substr(3, 2), 16);
  const blue = parseInt(hexValue.substr(5, 2), 16);
  const lightYellow = [255, 255, 224]; // RGB values for light yellow
  const deepRed = [139, 0, 0]; // RGB values for deep red
  const diffRed = deepRed[0] - lightYellow[0];
  const diffGreen = deepRed[1] - lightYellow[1];
  const diffBlue = deepRed[2] - lightYellow[2];
  const distanceToLightYellow = Math.sqrt(Math.pow(red - lightYellow[0], 2) + Math.pow(green - lightYellow[1], 2) + Math.pow(blue - lightYellow[2], 2));
  const totalDistance = Math.sqrt(Math.pow(diffRed, 2) + Math.pow(diffGreen, 2) + Math.pow(diffBlue, 2));
  const value = distanceToLightYellow / totalDistance;
  return value;
}

app.listen(8080, () => {
    console.log(`Server running on port 8080`)
});