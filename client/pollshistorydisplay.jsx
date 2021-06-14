import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

const modalStyle = {
  top: 50,
  left: 50,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function PollsHistoryDisplay(props) {
  const classes = useStyles();
  const [style] = React.useState(modalStyle);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const {
    method,
    question,
    creatorId,
    pollId,
    voteCount,
    responses,
    winner,
    active,
  } = props;
  console.log("responses", responses);
  const responsesDisplay = responses.map((res) => (
    <p>
      {res.userId} voted for {res.vote}
    </p>
  ));
  console.log("responsesDisplay", responsesDisplay);
  const body = (
    <div style={style} className={classes.paper}>
      <h2>Poll #{pollId}</h2>
      <p>Created By {creatorId}</p>
      <p>Evaluated with the {method} method</p>
      <p>Total Votes: {voteCount}</p>
      <h3 id="simple-modal-title">{question}</h3>
      <p>
        {winner.option} was the most voted for choice with {winner.count} votes
      </p>
      <div>{responsesDisplay}</div>
      <p>This is a(n) {active ? "open" : "closed"} poll</p>
    </div>
  );
  return (
    <div className="pollsHistoryDisplay">
      <h3>{question}</h3>
      <p>
        {winner.option} was the most voted for choice with {winner.count} votes
      </p>
      <button onClick={handleOpen}>More Info</button>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </div>
  );
}
