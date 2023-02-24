import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import {
  USER,
  UPDATE_USER,
  UPDATE_SUBSCRIPTION,
  UPDATE_POINTS,
} from "../../gql/users";

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
  const [point, setPoint] = useState(0);

  //update user
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

  //update subscription
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

  //Updat points
  const [editPoint] = useMutation(UPDATE_POINTS, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
    onCompleted: () => {
      setPoint(0);
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
  console.log(user);
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
            <ListItem>
              <ListItemText
                primary="Nutrition Routine Start Date"
                secondary={user.nutrition_routing_start_date}
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
            <ListItem>
              <ListItemText
                primary="Points"
                secondary={user.points}
                secondaryTypographyProps={{ color: "#59595a" }}
              />
            </ListItem>
          </Box>
        </Paper>
      </CardContent>

      <CardActions className="flex--3--cols">
        <Box className="first--cols">
          <Box className="user-text-box">
            <TextField
              label="Points"
              value={point}
              onChange={(e) => {
                e.preventDefault();
                setPoint(Number(e.target.value));
              }}
            ></TextField>
          </Box>

          <Box className="btn-user-update ">
            <Button
              size="large"
              variant="contained"
              onClick={() => {
                editPoint({
                  variables: { userId: user.id, pointAmount: user.points },
                });
              }}
            >
              update
            </Button>
          </Box>
        </Box>

        {/* subscription Update */}
        <Box className="first--cols">
          <Box className="user-text-box">
            {/* subscription */}

            <FormControl>
              <InputLabel>Subscription Type</InputLabel>
              <Select
                sx={{ width: 210, mr: 2 }}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                label="Subscription Type"
                defaultValue=""
                value={subType}
                onChange={(e) => {
                  setSubType(e.target.value);
                }}
              >
                <MenuItem disabled value="">
                  Choose Option
                </MenuItem>
                <MenuItem value="1">Basic</MenuItem>
                <MenuItem value="2">Medium</MenuItem>
                <MenuItem value="3">Premium</MenuItem>
                <MenuItem value="4">Special Package</MenuItem>
              </Select>
            </FormControl>
            {/* Date */}
            <TextField
              label="Date"
              value={date}
              onChange={(e) => {
                e.preventDefault();
                setDate(Number(e.target.value));
              }}
            />
          </Box>

          <Box className="btn-user-update">
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                editSubscription({
                  variables: {
                    userId: user.id,
                    subscription_type: subType,
                    durationInDays: date,
                  },
                });
              }}
            >
              Update
            </Button>
          </Box>
        </Box>

        <Box>
          {user.disabled ? (
            <Button
              variant="contained"
              size="large"
              color="warning"
              onClick={() =>
                editUser({ variables: { id: user.id, disabled: false } })
              }
            >
              Enable
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              color="error"
              onClick={() =>
                editUser({ variables: { id: user.id, disabled: true } })
              }
            >
              Disable
            </Button>
          )}
        </Box>
      </CardActions>
    </div>
  );
};

export default User;
