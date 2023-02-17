import {
  Typography,
  Button,
  Box,
  Card,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import RichTextEditor from "react-rte";
import { UPDATE_SPE_EACH_DAY } from "../../gql/specialNuRoutine";

const UpdateSpecialDayRoutine = (props) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());

  useEffect(() => {
    if (props.value) {
      setValues(props.values);
      setTextValue(
        RichTextEditor.createValueFromString(props.value[props.k] ?? "", "html")
      );
      console.log(textValue);
      console.log("props Value", props.value);
    }
  }, [props.value]);
  const handleClosClearData = () => {
    setValues({});
    setErrors({});
    props.handleClose();
  };

  const [updateDays] = useMutation(UPDATE_SPE_EACH_DAY, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 1000);
      setLoading(false);
    },
    onCompleted: () => {
      setValues({});
      setErrors({});
      setLoading(false);
      props.routineAlert("Routine have been updated.", false);
      props.handleClose();
    },
  });

  const handleUpdate = async () => {
    setLoading(true);
    setErrors({});

    try {
      updateDays({ variables: { ...values, id: props.id } });
    } catch (error) {
      console.log("error : ", error);
    }
  };
  const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: [
      "INLINE_STYLE_BUTTONS",
      "BLOCK_TYPE_BUTTONS",
      "LINK_BUTTONS",
      "BLOCK_TYPE_DROPDOWN",
      "HISTORY_BUTTONS",
    ],
    INLINE_STYLE_BUTTONS: [
      { label: "Bold", style: "BOLD", className: "custom-css-class" },
      { label: "Italic", style: "ITALIC" },
      { label: "Underline", style: "UNDERLINE" },
    ],
    BLOCK_TYPE_DROPDOWN: [
      { label: "Normal", style: "unstyled" },
      { label: "Heading Large", style: "header-one" },
      { label: "Heading Medium", style: "header-two" },
      { label: "Heading Small", style: "header-three" },
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" },
    ],
  };

  const onChange = (value) => {
    setTextValue(value);
    setValues({ ...values, [props.k]: value.toString("html") });
    //setValues(values);
  };

  if (!props.value) {
    return;
  }
  if (!values) {
    return;
  }

  return (
    <>
      <Box
        className="update-day"
        sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
      >
        <Typography variant="h5" component="h2" color="black" sx={{ mx: 4 }}>
          Update Days
        </Typography>
        <Button
          onClick={handleClosClearData}
          variant="contained"
          color="error"
          sx={{ mx: 4 }}
        >
          Close
        </Button>
      </Box>
      {/* day_1 */}
      <Card
        className="text-container"
        sx={{ borderTopRightRadius: 0, borderTopLeftRadius: 0 }}
      >
        <div className="text-item">
          <Box sx={{ padding: "1rem" }} className="text-box">
            <InputLabel style={{ marginBottom: 10, fontWeight: "bold" }}>
              Days
            </InputLabel>
            <RichTextEditor
              className="text-day"
              //onChange={handleChange("description")}
              onChange={onChange}
              value={textValue}
              toolbarConfig={toolbarConfig}
            />
            {/* {errors.value[props.k] && (
              <FormHelperText error> {errors.value[props.k]}</FormHelperText>
            )} */}
          </Box>
        </div>
        <Box className="btn_end">
          <LoadingButton
            variant="contained"
            //color="warning"
            size="large"
            loading={loading}
            onClick={handleUpdate}
          >
            Update
          </LoadingButton>
        </Box>
      </Card>
    </>
  );
};
export default UpdateSpecialDayRoutine;
