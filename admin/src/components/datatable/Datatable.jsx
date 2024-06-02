import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState([]);
  const { data, loading, error } = useFetch(`/${path}`);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setList(data);
  }, [data]);

  const handleDelete = async (id) => {
    try {
      if (id === user._id) {
        alert("Произошла ошибка");
        return;
      }

      await axios.delete(`/${path}/${id}`);
      setList(list.filter((item) => item._id !== id));
    } catch (err) {}
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Действия",
      width: 350,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div>
              <Link
                to={`/${path}/${params.row._id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="viewButton">Посмотреть</div>
              </Link>
            </div>
            {path !== "users" && path !== "bookings" && (
              <div>
                <Link
                  to={`/${path}/${params.row._id}/edit`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="viewButton">Редактировать</div>
                </Link>
              </div>
            )}
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Удалить
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {path}
        <Link to={`/${path}/new`} className="link">
          Добавить
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
