import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import CsvTable from "./CsvTable";
import './SearchQuery.css'

const SearchQuery = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchApplied, setSearchApplied] = useState(false);
  const [optionsChanged, setOptionsChanged] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    discYear: "",
    discoveryMethod: "",
    hostname: "",
    discFacility: "",
  });
  const batchSize = 30;

  useEffect(() => {
    const csvFilePath = "./assets/data.csv";

    fetch(csvFilePath)
      .then((response) => response.text())
      .then((csvFileContent) => {
        Papa.parse(csvFileContent, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const parsedData = results.data;
            setData(parsedData);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching CSV:", error);
      });
  }, []);
  
  const uniqueHostnames = [...new Set(data.map(item => item.hostname))].sort();
  const uniqueDiscYears = [...new Set(data.map(item => item.disc_year))].sort();
  const uniqueFacilities = [...new Set(data.map(item => item.disc_facility))].sort();
  const uniqueDiscoveryMethods = [...new Set(data.map(item => item.discoverymethod))].sort();
  
  const applySearchFilter = (item) => {
    if (searchApplied || optionsChanged) { 
      return (
        (searchQuery.discYear === "" || item.disc_year === parseInt(searchQuery.discYear)) &&
        (searchQuery.discoveryMethod === "" || item.discoverymethod === searchQuery.discoveryMethod) &&
        (searchQuery.hostname === "" || item.hostname === searchQuery.hostname) &&
        (searchQuery.discFacility === "" || item.disc_facility === searchQuery.discFacility)
      );
    } else {
      return true;
    }
  };


  const filteredData = searchApplied? data.filter(applySearchFilter): '';
  const totalPages = Math.ceil(filteredData.length / batchSize);
  const startIndex = (currentPage - 1) * batchSize;
  const visibleData = filteredData.slice(startIndex, startIndex + batchSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = () => {
    setSearchApplied(true);
    setOptionsChanged(false);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchQuery({
      discYear: "",
      discoveryMethod: "",
      hostname: "",
      discFacility: "",
    });
    setSearchApplied(false);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="search-panel">
        <select
          value={searchQuery.discYear}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, discYear: e.target.value })
          }
        >
          <option value="">Select Year of Discovery</option>
          {uniqueDiscYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={searchQuery.discoveryMethod}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, discoveryMethod: e.target.value })
          }
        >
          <option value="">Select Discovery Method</option>
          {uniqueDiscoveryMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
        <select
          value={searchQuery.hostname}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, hostname: e.target.value })
          }
        >
          <option value="">Select Host Name</option>
          {uniqueHostnames.map((hostname) => (
            <option key={hostname} value={hostname}>
              {hostname}
            </option>
          ))}
        </select>
        <select
          value={searchQuery.discFacility}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, discFacility: e.target.value })
          }
        >
          <option value="">Select Discovery Facility</option>
          {uniqueFacilities.map((facility) => (
            <option key={facility} value={facility}>
              {facility}
            </option>
          ))}
        </select>
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleClear}>Clear</button>
      </div>
      <CsvTable data={visibleData} searchApplied={searchApplied} />
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page
          <input
            type="number"
            value={currentPage}
            min={1}
            max={totalPages}
            onChange={(e) => handlePageChange(e.target.value)}
          />
          of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchQuery;
