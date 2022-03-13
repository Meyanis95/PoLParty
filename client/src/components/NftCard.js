import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Moralis from "moralis"

function NftCard(props) {
  const [floorPrice, setFloorPrice] = useState('');
  const [imgUrl, setImgUrl] = useState('https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png');
  const metadata = JSON.parse(props.nfts.metadata);

  const retreatIpfs = (metadata) => {
    if (metadata !== null && metadata.image) {
      var img = metadata.image
      if (img.substring(0, 4) === 'ipfs') {
        img = img.replace('ipfs://', 'https://ipfs.io/ipfs/')
        setImgUrl(img)
      } else {
        setImgUrl(metadata.image)
      }
    }
  }


  useEffect(() => {
    retreatIpfs(metadata);
  }, []);


  return (
    <Card>
      {metadata !== null ?
        <CardMedia
          component="img"
          height="200"
          image={imgUrl}
          alt="green iguana"
        /> : <CardMedia
          component="img"
          height="140"
          image='https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png'
          alt="green iguana"
        />}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" align='left' >
          {metadata.metadata.artist}
        </Typography>
        <Typography gutterBottom variant="h5" component="div" align='left' >
          {metadata.metadata.rarity}
        </Typography>
        <Typography gutterBottom variant="h5" component="div" align='left' >
          {metadata.attributes[3].value}
        </Typography>
      </CardContent>
    </Card>

  )
}

export default NftCard;