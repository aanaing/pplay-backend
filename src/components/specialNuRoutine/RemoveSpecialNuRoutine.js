import React from "react";
import { Typography } from "@mui/material";
const RemoveSpecialRoutine = () => {
  return (
    <div>
      <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
        Remove routine
      </Typography>
      <Typography
        id="keep-mounted-modal-description"
        variant="body"
        sx={{ mt: 2 }}
      >
        Are you sure want to remove?
      </Typography>
    </div>
  );
};

export default RemoveSpecialRoutine;
