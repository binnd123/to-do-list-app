import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useEffect } from "react";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableCell,
  tableCellClasses,
  TableRow,
  Paper,
  styled,
  TableFooter,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { deleteToDoList, getToDoList } from "../../api/toDoListApi";
import ModalToDoList from "../modal";
import { format } from "date-fns";

function TableToDoList() {
  const [reLoad, setReLoad] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedToDoListId, setSelectedToDoListId] = useState("");
  const [selectedToDoListTitle, setSelectedToDoListTitle] = useState("");
  const [selectedToDoListDescription, setSelectedToDoListDescription] =
    useState("");
  const [selectedToDoListStatus, setSelectedToDoListStatus] = useState("");
  const [selectedToDoListCompleteAt, setSelectedToDoListCompleteAt] =
    useState();
  const [selectedToDoListIsActive, setSelectedToDoListIsActive] =
    useState(true);
  const [selectedToDoListUserName, setSelectedToDoListUserName] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(0);

  const handleOpenModal = (
    toDoListId,
    toDoListTitle,
    toDoListDescription,
    toDoListStatus,
    toDoListCompleteAt,
    toDoListIsActive,
    toDoListUserName
  ) => {
    setSelectedToDoListId(toDoListId);
    setSelectedToDoListTitle(toDoListTitle);
    setSelectedToDoListDescription(toDoListDescription);
    setSelectedToDoListStatus(toDoListStatus);
    setSelectedToDoListCompleteAt(toDoListCompleteAt);
    setSelectedToDoListIsActive(toDoListIsActive);
    setSelectedToDoListUserName(toDoListUserName);
    setOpenModal(true); // Giả sử bạn có state `openModal` để mở modal
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setReLoad(!reLoad);
  };

  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChoose = (value) => () => {
    setRowsPerPage(value);
    setPage(1);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
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
  const [toDoListData, setToDoListData] = useState([]);
  const fetchData = async () => {
    const response = await getToDoList(page, rowsPerPage);
    setToDoListData(response.data.items);
    setTotalPage(response.data.totalPages);
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, reLoad]);

  const handleDelete = async (id) => {
    // Gọi API xóa dữ liệu
    const response = await deleteToDoList(id);
    console.log("API response:", response);
    // Sau khi xóa xong thì gọi lại hàm fetchData
    setReLoad(!reLoad);
  };

  const handleFirstPageButtonClick = () => {
    setPage(1);
  };

  const handleBackButtonClick = () => {
    setPage(page - 1);
  };

  const handleNextButtonClick = () => {
    setPage(page + 1);
  };

  const handleLastPageButtonClick = () => {
    setPage(totalPage);
  };

  return (
    <>
      <ModalToDoList
        openModal={openModal}
        handleClose={handleCloseModal}
        selectedToDoListId={selectedToDoListId}
        selectedToDoListTitle={selectedToDoListTitle}
        selectedToDoListDescription={selectedToDoListDescription}
        selectedToDoListStatus={selectedToDoListStatus}
        selectedToDoListCompleteAt={selectedToDoListCompleteAt}
        selectedToDoListIsActive={selectedToDoListIsActive}
        selectedToDoListUserName={selectedToDoListUserName}
      ></ModalToDoList>
      <h1>Table To Do List</h1>
      <Button variant="outlined" onClick={() => handleOpenModal()}>
        Add New
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell>No</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Create At</StyledTableCell>
              <StyledTableCell>Complete At</StyledTableCell>
              <StyledTableCell>Active</StyledTableCell>
              <StyledTableCell>Assignee</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {toDoListData.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {row.title}
                </StyledTableCell>
                <StyledTableCell>{row.description}</StyledTableCell>

                <StyledTableCell>{row.status}</StyledTableCell>
                <StyledTableCell>
                  {format(new Date(row.createdAt), "yyyy-MM-dd")}
                </StyledTableCell>
                <StyledTableCell>
                  {format(new Date(row.completeAt), "yyyy-MM-dd")}
                </StyledTableCell>
                <StyledTableCell>
                  {row.isActive ? "ACTIVE" : "INACTIVE"}
                </StyledTableCell>
                <StyledTableCell>{row.userName}</StyledTableCell>
                <StyledTableCell style={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleOpenModal(
                        row.toDoListId,
                        row.title,
                        row.description,
                        row.status,
                        row.completeAt,
                        row.isActive,
                        row.userName
                      )
                    }
                  >
                    Edit
                  </Button>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(row.toDoListId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  width: "600px",
                }}
              >
                <Button
                  id="demo-positioned-button"
                  aria-controls={open ? "demo-positioned-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  Rows per page: {rowsPerPage === 0 ? "All" : rowsPerPage}
                </Button>
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem onClick={handleChoose(0)}>All</MenuItem>
                  <MenuItem onClick={handleChoose(1)}>1</MenuItem>
                  <MenuItem onClick={handleChoose(2)}>2</MenuItem>
                  <MenuItem onClick={handleChoose(3)}>3</MenuItem>
                </Menu>
                <span style={{ width: "200px" }}>Page: {page}</span>
                <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                  <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page < 2}
                    aria-label="first page"
                  >
                    {/* rtl: Right To Left */}
                    {theme.direction === "rtl" ? (
                      <LastPageIcon />
                    ) : (
                      <FirstPageIcon />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={handleBackButtonClick}
                    disabled={page < 2}
                    aria-label="previous page"
                  >
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={handleNextButtonClick}
                    disabled={totalPage !== 1 ? page === totalPage : true}
                    aria-label="next page"
                  >
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={totalPage !== 1 ? page === totalPage : true}
                    aria-label="last page"
                  >
                    {theme.direction === "rtl" ? (
                      <FirstPageIcon />
                    ) : (
                      <LastPageIcon />
                    )}
                  </IconButton>
                </Box>
              </div>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
export default TableToDoList;
