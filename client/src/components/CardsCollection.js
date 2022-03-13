import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import NftCard from './NftCard'

function CollectionCard(props) {

  return (
    <Grid container sx={{ mt: '10px' }} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {props.nftArray.map((nft, index) => (
        nft.metadata !== null &&
        <Grid item xs={2} sm={4} md={4} key={index}>
          <NftCard nfts={nft} />
        </Grid>
      ))}
    </Grid>
  )
}

export default CollectionCard;