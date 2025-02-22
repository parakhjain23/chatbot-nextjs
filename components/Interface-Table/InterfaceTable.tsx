import { DataGrid } from "@mui/x-data-grid";

function generateColumns(data) {
  // Check if data is an object and not null
  if (typeof data !== "object" || data === null) {
    console.error("Invalid data format. Expected an object.");
    return [];
  }
  // Generate columns
  return Object.keys(data || {}).map((key) => ({
    id: key, // Use the key as the unique ID for each column definition
    field: key,
    headerName: key.toString().toUpperCase(),
    flex: 1,
  }));
}

function generateRows(data: any) {
  // Check if data is an array
  if (!Array.isArray(data)) {
    console.error("Invalid data format. Expected an array.");
    return [];
  }
  // Generate rows
  return (data || []).map((row, index) => ({ id: index, ...row }));
}
interface InterfaceTableProps {
  props: any;
}

function InterfaceTable({ props }: InterfaceTableProps) {
  const columns = generateColumns(props?.data?.[0]);
  const rows = generateRows(props?.data);
  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={rows || []}
        columns={columns || []}
        // hideFooterPagination={!props?.pagination || false}
        initialState={{
          pagination: props?.pagination
            ? {
                paginationModel: { page: 0, pageSize: 10 },
              }
            : {
                pageSize: props?.pagination ? 5 : undefined, // Sets initial page size if pagination is true
              },
        }}
        // pageSizeOptions={props.pagination ? [5, 10] : []}
        disableRowSelectionOnClick
        checkboxSelection={props?.checkbox || false}
        className="bg-white"
      />
    </div>
  );
}

export default InterfaceTable;
