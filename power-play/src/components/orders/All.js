import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Button,
  FormHelperText,
  Tooltip,
  Typography,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useLazyQuery } from "@apollo/client";
import { ORDERS, ORDERSWITHDATE, ORDERSBYID } from "../../gql/orders";

import { CSVLink } from "react-csv";

const headers = [
  { label: "ID", key: "id" },
  { label: "User Name", key: "username" },
  { label: "Total Price", key: "total_price" },
  { label: "Total Quantity", key: "total_quantity" },
  { label: "Updated At", key: "updated_at" },
  { label: "Created At", key: "created_at" },
  { label: "Status", key: "status" },
];

let data = [];

const All = ({ detailOrder }) => {
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [orders, setOrders] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [dateError, setDateError] = useState("");
  const [endDate, setEndDate] = useState(new Date());

  const [showExport, setShowExport] = useState(false);

  const [loadOrders, result] = useLazyQuery(ORDERS);
  const [loadOrderByID, resultByID] = useLazyQuery(ORDERSBYID);
  const [loadOrdersWithDate, resultWithDate] = useLazyQuery(ORDERSWITHDATE);

  useEffect(() => {
    if (search && !isNaN(search)) {
      setStartDate(null);
      loadOrderByID({ variables: { search: search - 1 + 1, status: "%%" } });
      return;
    }
    if (startDate && endDate) {
      if (startDate && endDate && startDate > endDate) {
        setDateError("Date From must be smaller than Date To!");
        return;
      }
      loadOrdersWithDate({
        variables: {
          limit: rowsPerPage,
          offset: offset,
          search: `%${search}%`,
          status: "%%",
          start: startDate,
          end: endDate,
        },
      });
    } else {
      loadOrders({
        variables: {
          limit: rowsPerPage,
          offset: offset,
          search: `%${search}%`,
          status: "%%",
        },
      });
    }
  }, [
    endDate,
    loadOrderByID,
    loadOrders,
    loadOrdersWithDate,
    offset,
    rowsPerPage,
    search,
    startDate,
  ]);

  useEffect(() => {
    if (result.data) {
      setOrders(result.data.user_order);
      setCount(Number(result.data?.user_order_aggregate.aggregate.count));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  useEffect(() => {
    if (startDate && endDate && resultWithDate.data) {
      setOrders(resultWithDate.data.user_order);
      setCount(
        Number(resultWithDate.data?.user_order_aggregate.aggregate.count)
      );
      let tempData = resultWithDate.data.user_order;
      let temp = tempData?.map((d) => {
        return {
          id: d.order_readable_id,
          username: d.user.username,
          total_price: d.total_price,
          total_quantity: d.total_quantity,
          updated_at: d.updated_at.substring(0, 10),
          created_at: d.created_at.substring(0, 10),
          status: d.order_status,
        };
      });
      data = temp;
      setShowExport(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultWithDate]);

  useEffect(() => {
    if (search && !isNaN(search) && resultByID.data) {
      setOrders(resultByID.data.user_order);
      setCount(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultByID]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(rowsPerPage * newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (!orders) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    );
  }

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          my: 2,
        }}
      >
        <FormControl sx={{ width: 300 }}>
          <TextField
            id="outlined-search"
            label="Search by User's name"
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </FormControl>
        <Box>
          <FormControl sx={{ mr: 2 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DesktopDatePicker
                label="Date From"
                value={startDate}
                onChange={(newValue) => {
                  setDateError("");
                  setStartDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              {dateError && <FormHelperText error>{dateError}</FormHelperText>}
            </LocalizationProvider>
          </FormControl>
          <FormControl>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DesktopDatePicker
                label="Date To"
                value={endDate}
                onChange={(newValue) => {
                  setDateError("");
                  setEndDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              {dateError && <FormHelperText error>{dateError}</FormHelperText>}
            </LocalizationProvider>
          </FormControl>
        </Box>
      </Box>
      <Typography>
        * When you select Date filter fields, you can export data as a{" "}
        <em>CVS file</em> by clicking <em>EXPORT button</em> at the bottom on
        table.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexFlow: "wrap row",
          "& > :not(style)": {
            m: 1,
            width: "100%",
            minHeight: "25vh",
          },
        }}
      >
        <TableContainer sx={{ maxHeight: "75vh" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 10 }}>ID</TableCell>
                <TableCell style={{ minWidth: 100 }}>User Name</TableCell>
                <TableCell style={{ minWidth: 70 }}>Total Price</TableCell>
                <TableCell style={{ minWidth: 70 }}>Total Quantity</TableCell>
                <TableCell style={{ minWidth: 70 }}>Updated At</TableCell>
                <TableCell style={{ minWidth: 70 }}>Created At</TableCell>
                <TableCell style={{ minWidth: 70 }}>Status</TableCell>
                <TableCell style={{ minWidth: 70 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((row, index) => (
                <TableRow
                  onClick={() => null}
                  key={index}
                  hover
                  role="checkbox"
                  tabIndex={-1}
                >
                  <TableCell>{row.order_readable_id}</TableCell>
                  <TableCell>{row.user.username}</TableCell>
                  <TableCell>{row.total_price}</TableCell>
                  <TableCell>{row.total_quantity}</TableCell>
                  <TableCell>{row.updated_at.substring(0, 10)}</TableCell>
                  <TableCell>{row.created_at.substring(0, 10)}</TableCell>
                  <TableCell>{row.order_status}</TableCell>
                  <TableCell>
                    <Button
                      color="secondary"
                      size="small"
                      onClick={() => detailOrder(row)}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {showExport && (
          <Tooltip
            title="Download CSV file which contains all data show in the table"
            placement="left"
            arrow
          >
            <Button>
              <CSVLink
                className="exportBtn"
                data={data}
                headers={headers}
                filename={`all-orders-${new Date().toISOString()}.csv`}
              >
                Export
              </CSVLink>
            </Button>
          </Tooltip>
        )}
      </Box>
    </div>
  );
};

export default All;
