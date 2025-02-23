import api from "./config/axiosConfig";

const getToDoList = async (pageNumber, pageSize) => {
  const response = await api.get(`toDoList/get-all-to-do-list?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return response.data;
};

const updateToDoList = async (id, toDoList) => {
  const response = await api.put(`toDoList/update-to-do-list/${id}`, toDoList);
  return response.data;
};

const createToDoList = async (toDoList) => {
  const response = await api.post(`toDoList/create-to-do-list`, toDoList);
  return response.data;
};

const deleteToDoList = async (id) => {
  const response = await api.delete(`toDoList/delete-to-do-list/${id}`);
  return response.data;
};
export { getToDoList, updateToDoList, createToDoList, deleteToDoList};
