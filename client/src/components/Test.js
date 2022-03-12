import React, { useState, useEffect } from 'react';
import { token } from '../spotify';
import { theme, mixins, media, Main } from '../styles';
import {
  getTopArtistShort,
  getTopArtistsMedium,
  getTopArtistsLong,
  getTopTracksShort,
} from '../spotify';
import styled from 'styled-components/macro';
import { Button } from '../styles';
import { IconInfo } from './icons';
import Loader from './Loader';
import { Link } from '@reach/router';
import axios from 'axios';
require('dotenv').config();
const { colors, fontSizes, spacing } = theme;
const pinataApiKey = process.env.PINATA_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_KEY;

const ArtistsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 20px;
  margin-top: 50px;
  ${media.tablet`
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  `};
  ${media.phablet`
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  `};
`;
const Artist = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const Mask = styled.div`
  ${mixins.flexCenter};
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 100%;
  font-size: 20px;
  color: ${colors.white};
  opacity: 0;
  transition: ${theme.transition};
  svg {
    width: 25px;
  }
`;
const ArtistArtwork = styled(Link)`
  display: inline-block;
  position: relative;
  width: 200px;
  height: 200px;
  ${media.tablet`
    width: 150px;
    height: 150px;
  `};
  ${media.phablet`
    width: 120px;
    height: 120px;
  `};
  &:hover,
  &:focus {
    ${Mask} {
      opacity: 1;
    }
  }
  img {
    border-radius: 100%;
    object-fit: cover;
    width: 200px;
    height: 200px;
    ${media.tablet`
      width: 150px;
      height: 150px;
    `};
    ${media.phablet`
      width: 120px;
      height: 120px;
    `};
  }
`;
const ArtistName = styled.a`
  margin: ${spacing.base} 0;
  border-bottom: 1px solid transparent;
  &:hover,
  &:focus {
    border-bottom: 1px solid ${colors.white};
  }
`;

const Title = styled.a`
  margin: ${spacing.base} 0;
  text-align: center;
`;

const Test = () => {
  const [accessToken, setAccessToken] = useState('');
  const [topArtist, setTopArtist] = useState(null);

  useEffect(() => {
    setAccessToken(token);
    const fetchData = async () => {
      const { data } = await getTopArtistShort();
      setTopArtist(data);
    };
    fetchData();
  }, []);

  const uploadMeta = () => {
    const url = `http://localhost:8888/upload-meta`;
    const date = new Date();
    const dataJson = {
      name: 'Pol Party',
      description:
        'This NFT is my Proof-Of-Listening based on my listening data on Spotify. Minted with PolParty',
      image: 'https://ipfs.io/ipfs/QmYRdvS6ju12opqjEFQC8fNnrj69yoYNzzxTPDPMGEwee8',
      slug: 'pol_party',
      metadata: {
        name: 'Pol Party',
        artist: topArtist.items[0].name,
        date: Date(),
        rarity: 'common',
      },
      attributes: [
        { trait_type: 'Artist', value: topArtist.items[0].name },
        { trait_type: 'Rarity', value: 'common' },
        { trait_type: 'Genre', value: topArtist.items[0].genres.join(', ') },
        {
          trait_type: 'Date',
          value: (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString(),
        },
      ],
    };
    const options = {
      url: url,
      params: { data: dataJson },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        return 'https://ipfs.io/ipfs/' + response.data.IpfsHash;
      })
      .catch(function (error) {
        //handle error here
      });
  };

  const mintNFT = _ipfsUrl => {
    const options = {
      url: 'http://localhost:8888/mint',
      params: { data: 'https://ipfs.io/ipfs/Qmc83e1RrH3jtnePa6CKtVwf5raK1VWbsttD5pRD6xhwJM' },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const mint = async () => {
    if (topArtist != null) {
      const url = await uploadMeta();
      mintNFT(url);
    }
  };

  return (
    <Main>
      <Title>Your top artist of the month!</Title>
      <ArtistsContainer>
        {topArtist ? (
          topArtist.items.map(({ id, external_urls, images, name }, i) => (
            <Artist key={i}>
              <ArtistArtwork to={`/artist/${id}`}>
                {images.length && <img src={images[1].url} alt="Artist" />}
                <Mask>
                  <IconInfo />
                </Mask>
              </ArtistArtwork>
              <ArtistName href={external_urls.spotify} target="_blank" rel="noopener noreferrer">
                {name}
              </ArtistName>
              <Button onClick={() => mint()}>Mint!</Button>
            </Artist>
          ))
        ) : (
          <Loader />
        )}
      </ArtistsContainer>
    </Main>
  );
};

export default Test;
