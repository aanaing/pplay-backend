import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CREATE_EXE_ROUTINE,
  DELETE_EXE_ROUTINE,
  EXE_ROUTINE,
  SUB_TYPE_NAME,
} from "../../gql/exeRoutine";
import RemoveExeRoutine from "../../components/exerciseRoutine/RemoveExeRoutine";
import CreateExeRoutine from "../../components/exerciseRoutine/CreateExeRoutine";
import UpdateExeRoutine from "../../components/exerciseRoutine/UpdateExeRoutine";
import DirectionsIcon from "@mui/icons-material/Directions";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import {
  Breadcrumbs,
  Button,
  TableBody,
  TablePagination,
  TableHead,
  TableRow,
  TableContainer,
  styled,
  Table,
  TableCell,
  tableCellClasses,
  Box,
  Modal,
  InputBase,
  Paper,
  Avatar,
  autocompleteClasses,
} from "@mui/material";
import { useLazyQuery, useMutation } from "@apollo/client";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100vw",
  height: "100vh",
  overflow: "scroll",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
};
const styleR = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  width: 300,
  backgroundColor: "#cecece",
};

const Routine = () => {
  //for search button
  const [search, setSearch] = useState("");

  //for routine modal
  const [removeRoutine, setRemoveRoutine] = useState("");
  const [updateRoutine, setUpdateRoutine] = useState("");
  const [removeOpen, setRemoveOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  //for alert message
  const [showAlert, setShowAlert] = useState("");

  // for pagination
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [subType, setSubType] = useState([]);
  const [loadRoutine, resutRoutine] = useLazyQuery(EXE_ROUTINE);
  const [loadSubType, resultSubType] = useLazyQuery(SUB_TYPE_NAME);
  const [routine, setRoutine] = useState({});

  // ---------------------****------------------------

  // get data from db
  useEffect(() => {
    loadSubType();
    loadRoutine();
  }, [loadSubType, loadRoutine]);

  useEffect(() => {
    if (resultSubType.data) {
      setSubType(resultSubType.data.video_sub_type);
    }
  }, [resultSubType]);

  useEffect(() => {
    if (resutRoutine.data) {
      setRoutine(resutRoutine.data.exercise_routine);
      console.log(resutRoutine.data.exercise_routine);
    }
  }, [resutRoutine]);

  //for search button
  const handleSearch = (e) => {
    setSearch(document.getElementById("search-by-title").value);
  };
  useEffect(() => {
    loadRoutine({ variables: { search: `%${search}%` } });
  }, [loadRoutine, search]);

  //------------- REMOVE ROUTINE -------------
  const [deleteRoutine] = useMutation(DELETE_EXE_ROUTINE, {
    onError: (error) => {
      console.log("error : ", error);
    },
    onCompleted: () => {
      setShowAlert({
        message: "Routine has been deleted",
        isError: false,
      });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
  });

  const handleRemove = () => {
    if (!removeRoutine) {
      return;
    }
    deleteRoutine({ variables: { id: removeRoutine.id } });
    resutRoutine.refetch();
    setRemoveOpen(false);
  };

  // for modal box
  const handleRemoveOpen = (row) => {
    setRemoveRoutine(row);
    setRemoveOpen(true);
  };

  const handleRemoveClose = () => {
    setRemoveOpen(false);
  };

  //------------ ADD routine -------------
  const routineAlert = (message, isError = false) => {
    setShowAlert({ message: "", isError: false });
    setTimeout(() => {
      setShowAlert({ message: "", isError: false });
    }, 3000);
  };

  const handleCreateOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    resutRoutine.refetch();
    setCreateOpen(false);
  };

  // ----------------------- UPDATE Routine --------------
  const handleUpdateOpen = (row) => {
    setUpdateRoutine(row);
    //setRoutine(row);
    setUpdateOpen(true);
  };
  const handleUpdateClose = () => {
    setUpdateOpen(false);
    resutRoutine.refetch();
  };

  // for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(rowsPerPage * newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      //      backgroundColor: theme.palette.grey[700],
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.black,
      fontSize: 18,
      fontWeight: "bold",
      minWidth: 70,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 15,
      //backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  if (!routine) {
    return <em>Loading .....</em>;
  }

  return (
    <>
      <div className="align">
        {/* dashboard */}
        <div>
          <Breadcrumbs
            aria-label="breadcrumb"
            fontWeight="bold"
            fontSize="1.2rem"
          >
            <Link to="/" className="dashboard">
              Dashboard
            </Link>
            <span>Exercise routine</span>
          </Breadcrumbs>
        </div>
        {/* search */}
        <div>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 350,
            }}
          >
            {/* Search Box */}

            <InputBase
              id="search-by-title"
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search By Routine Name"
              type="search"
            />

            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="warning"
              id="search-by-title"
              sx={{ p: "10px" }}
              aria-label="directions"
              value={search}
              onClick={handleSearch}
            >
              <DirectionsIcon />
            </IconButton>
          </Paper>
        </div>
      </div>
      <div>
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Button
            variant="contained"
            sx={{
              width: 100,
              height: 60,
              p: 2,
              fontWeight: "bold",
            }}
            color="secondary"
            onClick={handleCreateOpen}
          >
            Add
          </Button>
        </Box>
      </div>
      <div>
        <Box
          sx={{
            display: "flex",
            flexFlow: "wrap row",
            "& > :not(style)": {
              m: 1,
              width: "100%",
              minHeight: "25vh",
            },
            mt: "1rem",
          }}
        >
          <TableContainer sx={{ maxHeight: "60vh", Width: "10px" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell style={{ minWidth: 100 }}>
                    Routine name
                  </StyledTableCell>
                  <StyledTableCell style={{ minWidth: 100 }}>
                    Image
                  </StyledTableCell>
                  <StyledTableCell style={{ minWidth: 100 }}>
                    Routine Category
                  </StyledTableCell>
                  <StyledTableCell style={{ minWidth: 100 }}>
                    day_1
                  </StyledTableCell>
                  <StyledTableCell style={{ minWidth: 100 }}>
                    day_2
                  </StyledTableCell>
                  <StyledTableCell style={{ minWidth: 100 }}>
                    day_3
                  </StyledTableCell>
                  <StyledTableCell style={{ minWidth: 100 }}>
                    day_4
                  </StyledTableCell>
                  <StyledTableCell style={{ minWidth: 100 }}>
                    day_5
                  </StyledTableCell>
                  <StyledTableCell style={{ minWidth: 100 }}>
                    day_6
                  </StyledTableCell>
                  <StyledTableCell style={{ minWidth: 100 }}>
                    day_7
                  </StyledTableCell>
                  <StyledTableCell style={{ minWidth: 100 }}>
                    Actions
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(routine)
                  ? routine.map((row, index) => (
                      <StyledTableRow hover key={index}>
                        <StyledTableCell>
                          {row.id.substring(0, 8)}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.exercise_routine_name}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Avatar
                            alt="routine image"
                            src={row.thumbnail_image_url}
                            width="56px"
                            height="56px"
                          />
                        </StyledTableCell>

                        <StyledTableCell>
                          {row.routine_category ? row.routine_category : "-"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {subType.map((s) => {
                            if (s.id === row.day_1) {
                              return s.sub_type_name;
                            }
                          })}
                        </StyledTableCell>
                        <StyledTableCell>
                          {subType.map((s) => {
                            if (s.id === row.day_2) {
                              return s.sub_type_name;
                            }
                          })}
                        </StyledTableCell>
                        <StyledTableCell>
                          {subType.map((s) => {
                            if (s.id === row.day_3) {
                              return s.sub_type_name;
                            }
                          })}
                        </StyledTableCell>
                        <StyledTableCell>
                          {subType.map((s) => {
                            if (s.id === row.day_4) {
                              return s.sub_type_name;
                            }
                          })}
                        </StyledTableCell>
                        <StyledTableCell>
                          {subType.map((s) => {
                            if (s.id === row.day_5) {
                              return s.sub_type_name;
                            }
                          })}
                        </StyledTableCell>
                        <StyledTableCell>
                          {subType.map((s) => {
                            if (s.id === row.day_6) {
                              return s.sub_type_name;
                            }
                          })}
                        </StyledTableCell>
                        <StyledTableCell>
                          {subType.map((s) => {
                            if (s.id === row.day_7) {
                              return s.sub_type_name;
                            }
                          })}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Button
                            onClick={() => handleRemoveOpen(row)}
                            size="small"
                            color="error"
                          >
                            Remove
                          </Button>
                          <Button
                            onClick={() => handleUpdateOpen(row)}
                            size="small"
                            color="primary"
                          >
                            Edit
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  : "-"}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            sx={{ color: "black" }}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </div>
      <div>
        <Modal
          keepMounted
          open={removeOpen}
          onClose={handleRemoveClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box style={styleR} sx={{ px: 4, py: 4, borderColor: "black" }}>
            <RemoveExeRoutine />
            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button color="primary" onClick={handleRemoveClose}>
                Cancel
              </Button>
              <Button color="error" onClick={handleRemove}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
      <div>
        <Modal
          keepMounted
          open={createOpen}
          onClose={handleCreateClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box style={style}>
            <CreateExeRoutine
              routineAlert={routineAlert}
              handleClose={handleCreateClose}
            />
          </Box>
        </Modal>
      </div>
      <div>
        <Modal
          keepMounted
          open={updateOpen}
          onClose={handleUpdateClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box style={style}>
            <UpdateExeRoutine
              routineAlert={routineAlert}
              handleClose={handleUpdateClose}
              value={updateRoutine}
            />
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default Routine;
