
// eslint-disable-next-line react/prop-types
const Length = ({ setLength }) => {
  const handleChange = (e) => {
    setLength(Number(e.target.value));  // Ensuring it's a number
  };

  return (
    <div className="dt-length mb-2">
      <select className="form-select form-select-sm" onChange={handleChange}>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  );
};

export default Length;
