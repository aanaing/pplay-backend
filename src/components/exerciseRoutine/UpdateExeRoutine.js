import { useLazyQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { LoadingButton } from "@mui/lab";

import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Box } from "@mui/system";
import { validateSDL } from "graphql/validation/validate";
import { useEffect, useState } from "react";
import {
  CREATE_EXE_ROUTINE,
  SUB_TYPE_NAME,
  UPDATE_EXE_ROUTINE,
} from "../../gql/exeRoutine";

const UpdateExeRoutine = ({ handleClose, routineAlert, value }) => {
  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sub, setSub] = useState(null);
  const [loadSub, resultSub] = useLazyQuery(SUB_TYPE_NAME);

  useEffect(() => {
    console.log("value work");
    if (value) {
      value = Object.assign({}, value);
      delete value.created_at;
      delete value.updated_at;
      delete value.__typename;
      console.log("original", value);
      setValues(value);
    }
  }, [value]);

  useEffect(() => {
    loadSub();
  }, [loadSub]);

  useEffect(() => {
    if (resultSub.data) {
      setSub(resultSub.data.video_sub_type);
    }
  }, [resultSub]);

  // if(values){
  //   values.day_1 = "min khant";
  //   console.log("updateValues", values.day_1);
  // }

  const [updateRoutine] = useMutation(UPDATE_EXE_ROUTINE, {
    onError: (error) => {
      console.log("error:", error);
      setLoading(false);
    },
    onCompleted: (data) => {
      setValues({});
      setErrors({});
      setLoading(false);
      routineAlert("Routine has been updated");
      handleUpdateClose();
    },
  });

  useEffect(() => {
    setValues(value);
  }, [value]);

  //console.log(values);

  const handleUpdateClose = () => {
    setValues({});
    setErrors({});
    handleClose();
  };
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleCreate = () => {
    setLoading(true);
    setErrors({});

    let isErrorExit = false;
    let errorObject = {};

    if (!values.exercise_routine_name) {
      errorObject.exercise_routine_name = "Routine Name is required";
      isErrorExit = true;
    }
    if (!values.day_1) {
      errorObject.day_1 = "Day 1 is required";
      isErrorExit = true;
    }
    if (!values.day_2) {
      errorObject.day_2 = "Day 2 is required";
      isErrorExit = true;
    }
    if (!values.day_3) {
      errorObject.day_3 = "Day 3 is required";
      isErrorExit = true;
    }
    if (!values.day_4) {
      errorObject.day_4 = "Day 4 is required";
      isErrorExit = true;
    }
    if (!values.day_5) {
      errorObject.day_5 = "Day 5 is required";
      isErrorExit = true;
    }
    if (!values.day_6) {
      errorObject.day_6 = "Day 6 is required";
      isErrorExit = true;
    }
    if (!values.day_7) {
      errorObject.day_7 = "Day 7 is required";
      isErrorExit = true;
    }

    if (isErrorExit) {
      setErrors(errorObject);
      setLoading(false);
      return;
    }
    try {
      // console.log(values);
      updateRoutine({ variables: { ...values } });
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  if (!values) {
    console.log("no values, loading");
    return "no values";
  }

  if (!value) {
    console.log("no data,  loading");
    return "no data";
  }

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: "black",
          maxWidth: 820,
          bgcolor: "#cecece",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          py: 2,
        }}
      >
        <Typography variant="h5" component="h2" color="black" sx={{ mx: 4 }}>
          Update Routine
        </Typography>
        <Button
          onClick={handleUpdateClose}
          variant="contained"
          color="error"
          sx={{ mx: 4 }}
        >
          Close
        </Button>
      </Box>
      <Card
        sx={{
          display: "flex",
          justifyContent: "flex-start",

          bgcolor: "white",
          maxWidth: 820,
          borderRadius: 0,
          height: 500,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <CardContent sx={{ my: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minWidth: 330,
              ml: 5,
            }}
          >
            <TextField
              id="exercise_routine_name"
              label="exercise_routine_name"
              sx={{ my: 2 }}
              value={values.exercise_routine_name}
              onChange={handleChange("exercise_routine_name")}
              error={errors.exercise_routine_name ? true : false}
              helperText={errors.exercise_routine_name}
              InputLabelProps={{ shrink: "shrink" }}
            />

            <FormControl variant="outlined" sx={{ my: 2 }}>
              <InputLabel id="sub_type">day_1</InputLabel>
              <Select
                labelId="day_1"
                value={values.day_1}
                label="day_1"
                onChange={handleChange("day_1")}
                error={errors.day_1 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => {
                      if (sub.id === values.day_1) {
                        console.log("default values");
                      }
                      console.log(sub.id);
                      return (
                        <MenuItem key={sub.id} value={sub.id}>
                          {sub.sub_type_name}
                        </MenuItem>
                      );
                    })
                  : null}
              </Select>
              {errors.day_1 && (
                <FormHelperText error>{errors.day_1}</FormHelperText>
              )}
            </FormControl>

            <FormControl variant="outlined" sx={{ my: 2 }}>
              <InputLabel id="sub_type">day_2</InputLabel>
              <Select
                labelId="day_2"
                label="day_2"
                value={values.day_2}
                onChange={handleChange("day_2")}
                error={errors.day_2 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.day_2 && (
                <FormHelperText error>{errors.day_2}</FormHelperText>
              )}
            </FormControl>
            <FormControl variant="outlined" sx={{ my: 2 }}>
              <InputLabel id="sub_type">day_3</InputLabel>
              <Select
                labelId="day_3"
                label="day_3"
                onChange={handleChange("day_3")}
                value={values.day_3}
                error={errors.day_3 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.day_3 && (
                <FormHelperText error>{errors.day_3}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <LoadingButton
            variant="contained"
            //color="warning"
            size="large"
            sx={{ maxWidth: 100, mt: "1rem", left: "90%", height: 60 }}
            loading={loading}
            onClick={handleCreate}
          >
            Update
          </LoadingButton>
        </CardContent>
        <div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mx: 2,
              mr: 4,
              my: 4,
              minWidth: 330,
            }}
          >
            <FormControl variant="outlined" sx={{ my: 2 }}>
              <InputLabel id="sub_type">day_4</InputLabel>
              <Select
                labelId="day_4"
                label="day_4"
                onChange={handleChange("day_4")}
                value={values.day_4}
                error={errors.day_4 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.day_4 && (
                <FormHelperText error>{errors.day_4}</FormHelperText>
              )}
            </FormControl>
            <FormControl variant="outlined" sx={{ my: 2 }}>
              <InputLabel id="sub_type">day_5</InputLabel>
              <Select
                labelId="day_5"
                label="day_5"
                onChange={handleChange("day_5")}
                value={values.day_5}
                error={errors.day_5 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.day_5 && (
                <FormHelperText error>{errors.day_5}</FormHelperText>
              )}
            </FormControl>
            <FormControl variant="outlined" sx={{ my: 2 }}>
              <InputLabel id="sub_type">day_6</InputLabel>
              <Select
                labelId="day_6"
                label="day_6"
                onChange={handleChange("day_6")}
                value={values.day_6}
                error={errors.day_6 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.day_6 && (
                <FormHelperText error>{errors.day_6}</FormHelperText>
              )}
            </FormControl>
            <FormControl variant="outlined" sx={{ my: 2 }}>
              <InputLabel id="sub_type">day_7</InputLabel>
              <Select
                labelId="day_7"
                label="day_7"
                onChange={handleChange("day_7")}
                value={values.day_7}
                error={errors.day_7 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.day_7 && (
                <FormHelperText error>{errors.day_7}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </div>
      </Card>
    </div>
  );
};

export default UpdateExeRoutine;
