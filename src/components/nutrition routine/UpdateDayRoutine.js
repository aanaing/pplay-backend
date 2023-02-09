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
import { UPDATE_EACH_DAY } from "../../gql/nuRoutine";

const UpdateDayRoutine = (props) => {
  console.log(props);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [textValue1, setTextValue1] = useState(
    RichTextEditor.createEmptyValue()
  );
  const [textValue2, setTextValue2] = useState(
    RichTextEditor.createEmptyValue()
  );
  const [textValue3, setTextValue3] = useState(
    RichTextEditor.createEmptyValue()
  );

  useEffect(() => {
    if (props.value) {
      //props.value = Object.assign({}, props.value);
      // delete props.value.created_at;
      // delete props.value.updated_at;
      // delete props.value.__typename;
      // console.log("original", props.value);
      setValues(props.value);
    }
  }, [props.value]);
  const handleClosClearData = () => {
    setValues({});
    setErrors({});
    props.handleClose();
  };
  const onChange1 = (value) => {
    setTextValue1(value);
    setValues({ ...values, day_1: value.toString("html") });
  };
  const onChange2 = (value) => {
    setTextValue2(value);
    setValues({ ...values, day_2: value.toString("html") });
  };
  const onChange3 = (value) => {
    setTextValue3(value);
    setValues({ ...values, day_3: value.toString("html") });
  };

  const [updateDays] = useMutation(UPDATE_EACH_DAY, {
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
      updateDays({ variables: { ...values, id: props.value.id } });
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
              Day_1
            </InputLabel>
            <RichTextEditor
              className="text-day"
              //onChange={handleChange("description")}
              onChange={onChange1}
              value={textValue1}
              toolbarConfig={toolbarConfig}
            />
            {errors.description && (
              <FormHelperText error> {errors.description}</FormHelperText>
            )}
          </Box>
        </div>
        <Box className="add">
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
      ;{/* day_2 */}
      <Card
        className="text-container"
        sx={{ borderTopRightRadius: 0, borderTopLeftRadius: 0 }}
      >
        <div className="text-item">
          <Box sx={{ padding: "1rem" }} className="text-box">
            <InputLabel style={{ marginBottom: 10, fontWeight: "bold" }}>
              Day_2
            </InputLabel>
            <RichTextEditor
              className="text-day"
              //onChange={handleChange("description")}
              onChange={onChange2}
              value={textValue2}
              toolbarConfig={toolbarConfig}
            />
            {errors.day_2 && (
              <FormHelperText error> {errors.day_2}</FormHelperText>
            )}
          </Box>
        </div>
        <Box className="add">
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
      {/* day_3 */}
      <Card
        className="text-container"
        sx={{ borderTopRightRadius: 0, borderTopLeftRadius: 0 }}
      >
        <div className="text-item">
          <Box sx={{ padding: "1rem" }} className="text-box">
            <InputLabel style={{ marginBottom: 10, fontWeight: "bold" }}>
              Day_3
            </InputLabel>
            <RichTextEditor
              className="text-day"
              //onChange={handleChange("description")}
              onChange={onChange3}
              value={textValue3}
              toolbarConfig={toolbarConfig}
            />
            {errors.day_3 && (
              <FormHelperText error> {errors.day_3}</FormHelperText>
            )}
          </Box>
        </div>
        <Box className="add">
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
export default UpdateDayRoutine;
