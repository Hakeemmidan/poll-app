import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import { vote, unvote } from '../../util/api_util';
import { UserContext } from 'components/contexts/UserContext';
import { PollContext } from 'components/contexts/PollContext';

export default function PollImages(props) {
  const user = useContext(UserContext);
  const pollCtx = useContext(PollContext);
  const imageSize = props.imageSize ? props.imageSize : '65px';
  const favIconSize = props.favIconSize ? props.favIconSize : 'default';
  const justifyContainer = props.justifyContainer
    ? props.justifyContainer
    : 'center';
  // has max length of 2 & only includes 0 and 1
  const currUserVotesImageIdxs = props.votes.map((vote) => {
    if (vote.userId._id === user._id) {
      return vote.pollImageIdx;
    }
  });

  const handleVote = (imageIdx) => {
    vote(props.pollId, imageIdx, (err, data) => {
      if (err) {
        alert(err);
      } else {
        pollCtx.setPollState(data);
      }
    });
  };

  const handleUnvote = (imageIdx) => {
    unvote(props.pollId, imageIdx, (err, data) => {
      if (err) {
        alert(err);
      } else {
        pollCtx.setPollState(data);
      }
    });
  };

  return (
    <Grid justify={justifyContainer} container spacing={2}>
      {props.images.map((image, idx) => {
        return (
          <Grid item key={idx}>
            <img
              style={{ width: imageSize, height: imageSize }}
              src={image.url}
            />
            <Grid container justify="center">
              <Grid item>
                {currUserVotesImageIdxs.includes(idx) ? (
                  <FavoriteIcon
                    onClick={() => handleUnvote(idx)}
                    ontSize={favIconSize}
                    color="secondary"
                  />
                ) : (
                  <FavoriteBorderIcon
                    onClick={() => handleVote(idx)}
                    fontSize={favIconSize}
                    htmlColor="lightgrey"
                  />
                )}
              </Grid>
              <Grid item>{image.numVotes}</Grid>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}

PollImages.propTypes = {
  pollId: PropTypes.string.isRequired,
  votes: PropTypes.array.isRequired,
  images: PropTypes.array.isRequired,
  imageSize: PropTypes.string,
  favIconSize: PropTypes.string,
  justifyContainer: PropTypes.string,
};