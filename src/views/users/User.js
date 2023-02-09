import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { USER, UPDATE_USER, UPDATE_SUBSCRIPTION } from "../../gql/users";

import {
  Breadcrumbs,
  Typography,
  Box,
  Paper,
  CardContent,
  CardActions,
  Button,
  ListItem,
  ListItemText,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  TextField,
} from "@mui/material";
//import AddressTable from "../../components/users/AddressTable";
import "../../style/App.css";
import { bgcolor } from "@mui/system";

const User = () => {
  const { id } = useParams();
  const result = useQuery(USER, { variables: { id: id } });
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const [subType, setSubType] = useState("");
  const [date, setDate] = useState(0);

  //database part
  const [editUser] = useMutation(UPDATE_USER, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
    onCompleted: () => {
      setShowAlert({ message: "User have been updated.", isError: false });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
    refetchQueries: [User],
  });

  const [editSubscription] = useMutation(UPDATE_SUBSCRIPTION, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
    onCompleted: (data) => {
      const { message } = data.subscription;
      console.log(message);
      setSubType("");
      setDate(0);
      setShowAlert({ message: "User have been updated.", isError: false });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
    refetchQueries: [User],
  });

  //if no data in result
  if (result.loading) {
    return (
      <div className="loading">
        <em>Loading...</em>
      </div>
    );
  }
  let user = result.data.users_by_pk;

  //Change data from String to object with JSON
  if (typeof result.data.users_by_pk.address !== "object") {
    try {
      let address = JSON.parse(result.data.users_by_pk.address);
      user = { ...result.data.users_by_pk, address };
    } catch (e) {
      user = { ...result.data.users_by_pk };
    }
  } else user = { ...result.data.users_by_pk, address: "-" };
  // console.log(user.gender);
  return (
    <div>
      <div role="presentation" className="align">
        <Breadcrumbs
          aria-label="breadcrumb"
          fontWeight="bold"
          fontSize="1.2rem"
        >
          <Link to="/" className="dashboard">
            Dashboard
          </Link>
          <Link to="/" className="user">
            Users
          </Link>
          <span>{id}</span>
        </Breadcrumbs>
      </div>
      <Typography variant="h5" component="h2" sx={{ m: 3, color: "black" }}>
        User Details
      </Typography>
      <CardContent sx={{ display: "flex" }}>
        <Paper
          elevation={1}
          sx={{
            flex: 4,
            mx: 3,
            py: 5,
            //bgcolor: "#262626",
            color: "black",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Box sx={{ color: "black" }}>
            <ListItem>
              <ListItemText
                primary="ID"
                secondary={user.id}
                secondaryTypographyProps={{ color: "#59595a" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Name"
                secondary={user.username}
                secondaryTypographyProps={{ color: "#59595a" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Phone"
                secondary={user.phone}
                secondaryTypographyProps={{ color: "#59595a" }}
              />
            </ListItem>
            <ListItem>
              {typeof user.address == "object" ? (
                <ListItemText
                  primary="Address"
                  secondary={user.address.address}
                  secondaryTypographyProps={{ color: "#59595a" }}
                />
              ) : (
                <ListItemText
                  primary="Address"
                  secondary={user.address}
                  secondaryTypographyProps={{ color: "#59595a" }}
                />
              )}
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Date of Birth"
                secondary={user.dob}
                secondaryTypographyProps={{ color: "#59595a" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Gender"
                secondary={user.gender}
                secondaryTypographyProps={{ color: "#59595a" }}
              />
            </ListItem>
          </Box>
          <Box>
            <ListItem>
              <ListItemText
                primary="basic_Subscription_timeout"
                secondary={user.basic_subscription_timeout}
                secondaryTypographyProps={{ color: "#59595a" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="medium_Subscription_timeout"
                secondary={user.medium_subscription_timeout}
                secondaryTypographyProps={{ color: "#59595a" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="premium_Subscription_timeout"
                secondary={user.premium_subscription_timeout}
                secondaryTypographyProps={{ color: "#59595a" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="special_Subscription_timeout"
                secondary={user.special_subscription_timeout}
                secondaryTypographyProps={{ color: "#59595a" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Created At"
                secondary={user.created_at}
                secondaryTypographyProps={{ color: "#59595a" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Updated At"
                secondary={user.updated_at}
                secondaryTypographyProps={{ color: "#59595a" }}
              />
            </ListItem>
          </Box>
        </Paper>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel
              id="demo-simple-select-helper-label"
              sx={{ color: "black" }}
            >
              Subscription Type
            </InputLabel>
            <Select
              //sx={style}
              sx={{
                // "& .MuiInputLabel-root": { color: "white" }, //styles the label
                // ".MuiOutlinedInput-notchedOutline": {
                //   borderColor: "#ed8618",
                // },

                // "&:hover .MuiOutlinedInput-notchedOutline": {
                //   borderColor: "#ed8618",
                // },

                // "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                //   borderColor: "#ed8618",
                // },
                // "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                //   {
                //     borderColor: "#ed8618",
                //   },
                // "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                //   {
                //     borderColor: "#ed8618",
                //   },

                width: 200,
                color: "black",
              }}
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              label="Subscription Type"
              value={subType}
              onChange={(e) => setSubType(e.target.value)}
              helperText="Please select your subscription"
            >
              <MenuItem value="1">Basic</MenuItem>
              <MenuItem value="2">Medium</MenuItem>
              <MenuItem value="3">Premium</MenuItem>
              <MenuItem value="4">Special Package</MenuItem>
            </Select>
          </FormControl>

          <TextField
            //sx={style}
            sx={{
              // "& .MuiInputLabel-root": { color: "black" }, //styles the label
              // ".MuiOutlinedInput-notchedOutline": {
              //   borderColor: "black",
              // },
              // "&:hover .MuiOutlinedInput-notchedOutline": {
              //   borderColor: "#ed8618",
              // },
              // "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
              //   {
              //     borderColor: "#ed8618",
              //   },
              width: 200,
              mt: 1,
              color: "black",
            }}
            variant="outlined"
            label="Date"
            value={date}
            onChange={(e) => {
              e.preventDefault();
              setDate(Number(e.target.value));
            }}
          />
        </Box>

        {user.disabled ? (
          <Button
            className="btn"
            variant="contained"
            //color="warning"
            onClick={() =>
              editUser({ variables: { id: user.id, disabled: false } })
            }
          >
            Enable
          </Button>
        ) : (
          <Button
            variant="contained"
            //color="warning"
            onClick={() =>
              editUser({ variables: { id: user.id, disabled: true } })
            }
          >
            Disable
          </Button>
        )}
      </CardActions>
      <Box>
        <Button
          sx={{ marginLeft: 19, mt: 2 }}
          variant="contained"
          //color="warning"
          onClick={() => {
            editSubscription({
              variables: { id: user.id, type: subType, date: date },
            });
          }}
        >
          Update
        </Button>
      </Box>
    </div>
  );
};

export default User;
