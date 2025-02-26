import {
  Box,
  Button,
  Fade,
  Input,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { createToDoList, updateToDoList } from "../../api/toDoListApi";

export default function ModalToDoList({
  openModal = false,
  handleClose,
  selectedToDoListId = null,
  selectedToDoListTitle = null,
  selectedToDoListDescription = null,
  selectedToDoListStatus = null,
  selectedToDoListCompleteAt = dayjs(),
  selectedToDoListIsActive = true,
  selectedToDoListUserName = null,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);

    const requestData = {
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status"),
      completeAt: formData.get("completeAt"),
      isActive: formData.get("isActive") === "true",
      userName: formData.get("userName"),
    };
    try {
      if (selectedToDoListId) {
        const response = await updateToDoList(selectedToDoListId, requestData);
        console.log("API response:", response);
        alert("Thay đổi thành công!");
      } else {
        const response = await createToDoList(requestData);
        console.log("API response:", response);
        alert("Tạo thành công!");
      }
    } catch (error) {
      console.error(
        "Lỗi Form",
        error.response ? error.response.data : error.message
      );
      alert("Thay đổi thất bại. Kiểm tra lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModal}
      onClose={handleClose}
      closeAfterTransition
      slots={{ Backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openModal}>
        <Box sx={style}>
          {selectedToDoListId ? (
            <h2 style={{ textAlign: "center" }}>Update</h2>
          ) : (
            <h2 style={{ textAlign: "center" }}>Create</h2>
          )}
          <form onSubmit={handleSubmit}>
            <Input type="hidden" name="toDoListId" value={selectedToDoListId} />

            {/* <LocalizationProvider sx={style} dateAdapter={AdapterDayjs}>
              <Box
                sx={{
                  mt: 2,
                  mb: 1,
                  display: "flex",
                  gap: 2,
                  justifyContent: "space-between",
                }}
              >
                <DesktopDatePicker
                  label="Complete At"
                  name="completeAt"
                  margin="normal"
                  disablePast // Làm mờ và vô hiệu hóa ngày trước hiện tại
                  defaultValue={
                    selectedToDoListId === null
                      ? dayjs()
                      : selectedToDoListCompleteAt
                  } // Mặc định ngày hiện tại
                  format="YYYY-MM-DD"
                  renderInput={(params) => (
                    <TextField {...params} required fullWidth size="small" />
                  )}
                />
              </Box>
            </LocalizationProvider> */}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Complete At"
                name="completeAt"
                id="completeAt"
                margin="normal"
                disablePast
                defaultValue={
                  selectedToDoListId === null
                    ? dayjs()
                    : dayjs(selectedToDoListCompleteAt)
                }
                format="YYYY-MM-DD"
                slotProps={{
                  textField: { fullWidth: true, size: "small", required: true },
                }} // ✅ Đúng cú pháp MUI v5
              />
            </LocalizationProvider>

            <TextField
              name="title"
              label="Title"
              id="title"
              autoComplete="off" // 🔥 Thêm dòng này
              required={selectedToDoListId === null}
              defaultValue={
                selectedToDoListId === null ? "" : selectedToDoListTitle
              }
              type="text"
              size="small"
              fullWidth
              margin="normal"
            />
            <TextField
              name="description"
              label="Description"
              id="description"
              autoComplete="off" // 🔥 Thêm dòng này
              required={selectedToDoListId === null}
              defaultValue={
                selectedToDoListId === null ? "" : selectedToDoListDescription
              }
              type="text"
              size="small"
              fullWidth
              margin="normal"
            />
            <TextField
              name="userName"
              label="Assignee"
              id="username"
              autoComplete="off" // 🔥 Thêm dòng này
              required={selectedToDoListId === null}
              type="text"
              size="small"
              defaultValue={
                selectedToDoListId === null ? "" : selectedToDoListUserName
              }
              fullWidth
              margin="normal"
            />
            <TextField
              name="status"
              label="Status"
              id="status"
              autoComplete="off" // 🔥 Thêm dòng này
              required={selectedToDoListId === null}
              defaultValue={
                selectedToDoListId === null ? "" : selectedToDoListStatus
              }
              type="text"
              size="small"
              fullWidth
              margin="normal"
            />
            <TextField
              name="isActive"
              label="Active"
              id="isActive"
              required={selectedToDoListId === null}
              size="small"
              defaultValue={
                selectedToDoListId === null ? true : selectedToDoListIsActive
              }
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? "Đang cập nhật..." : "Lưu"}
            </Button>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
}
