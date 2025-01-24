const SearchQuery = ({ searchTerm, setSearchTerm }) => {
    const handleChange = (e) => {
      setSearchTerm(e.target.value);
    };
  
    return (
      <div className="dt-search mb-2">
        <input
          type="search"
          className="form-control form-control-sm"
          placeholder="Search ID, Name or Surname..."
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
    );
  };
  
  export default SearchQuery;