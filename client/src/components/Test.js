import React, { useState, useEffect } from 'react';
import { token } from '../spotify';
import { theme, mixins, media, Main } from '../styles';
import { getTopArtistShort } from '../spotify';
import styled from 'styled-components/macro';
import { Button } from '../styles';
import { IconInfo } from './icons';
import Loader from './Loader';
import { Link } from '@reach/router';
import axios from 'axios';
import { useAppContext } from '../utils/stateContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { colors, fontSizes, spacing } = theme;

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
const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
  margin-top: ${spacing.base};
`;
const Stat = styled.div`
  text-align: center;
`;
const Number = styled.div`
  color: ${colors.green};
  font-weight: 700;
  font-size: ${fontSizes.md};
`;
const NumLabel = styled.p`
  color: ${colors.lightGrey};
  font-size: ${fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: ${spacing.xs};
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
  display: grid;
  text-align: center;
  font-weight: bold;
  font-size: 30px;
`;
const notifyMinting = () =>
  toast.info('Transaction sent!', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
const notifyMinted = () =>
  toast.success('PoL minted!', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

const Test = () => {
  const [accessToken, setAccessToken] = useState('');
  const [topArtist, setTopArtist] = useState(null);
  const [rarity, setRarity] = useState(null);
  const { address, setAddress } = useAppContext();

  useEffect(() => {
    setAccessToken(token);
    const fetchData = async () => {
      const { data } = await getTopArtistShort();
      setTopArtist(data);
    };
    fetchData();
    console.log('l\'adresse que je récupère dans test', address);
  }, []);

  useEffect(() => {
    if (topArtist !== null) {
      if (topArtist.items[0].popularity < 50) {
        setRarity('Epic');
      } else if (topArtist.items[0].popularity >= 50 && topArtist.items[0].popularity < 60) {
        setRarity('Rare');
      } else if (topArtist.items[0].popularity >= 60 && topArtist.items[0].popularity < 75) {
        setRarity('Special');
      } else {
        setRarity('Common');
      }
    }
  }, [topArtist]);

  const uploadMeta = async () => {
    return new Promise(async (resolve, reject) => {
      const url = `http://localhost:8888/upload-meta`;
      const date = new Date();
      const dataJson = {
        name: 'Pol Party',
        description:
          'This NFT is my Proof-Of-Listening based on my listening data on Spotify. Minted with PolParty',
        image: 'https://ipfs.io/ipfs/QmSZcW7Nie38TMdXz97zUWBjGw4vJvBVVJLXFVhY3jvWNm',
        slug: 'pol_party',
        metadata: {
          name: 'Pol Party',
          artist: topArtist.items[0].name,
          date: Date(),
          rarity: rarity,
        },
        attributes: [
          { trait_type: 'Artist', value: topArtist.items[0].name },
          { trait_type: 'Rarity', value: rarity },
          { trait_type: 'Genre', value: topArtist.items[0].genres.join(', ') },
          {
            trait_type: 'Date',
            value: `${(date.getMonth() + 1).toString()}-${date.getFullYear().toString()}`,
          },
        ],
      };
      const options = {
        url: url,
        params: { data: dataJson },
      };
      try {
        axios
          .request(options)
          .then(function (response) {
            console.log(response.data);
            resolve(`https://ipfs.io/ipfs/${response.data.IpfsHash}`);
          })
          .catch(function (error) {
            //handle error here
          });
      } catch (err) {
        resolve(err)
      }
    })
  };

  const mintNFT = (_ipfsUrl) => {
    notifyMinting();
    const options = {
      url: 'http://localhost:8888/mint',
      params: {
        data: _ipfsUrl,
        address: address,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        notifyMinted();
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
      <ToastContainer />
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
              <Stats>
                <Stat></Stat>
                <Stat>
                  <NumLabel>Rarity</NumLabel>
                  <Number>{rarity}</Number>
                </Stat>
              </Stats>
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
