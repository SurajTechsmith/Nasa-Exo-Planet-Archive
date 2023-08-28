import React from 'react';
import './CsvTable.css';

const CsvTable = ({ data, searchApplied }) => {
  const hasData = data.length > 0;
  const hasSearchQuery = searchApplied;

  return (
  <>
      {hasData ? (
        <>
<div className="data-table-container">
  <div className="table-row header">
    <div>Planet Name</div>
    <div>Host Name</div>
    <div>Discovery Method</div>
    <div>Discovery Year</div>
    <div>Discovery Facility</div>
  </div>
  {data.map((item, index) => (
    <div className="table-row" key={index}>
      <div>{item.pl_name}</div>
      <div>{item.hostname}</div>
      <div>{item.discoverymethod}</div>
      <div>{item.disc_year}</div>
      <div>{item.disc_facility}</div>
    </div>
  ))}
</div>

        </>
      ) : (
        <p className="empty-data-message">
          {hasSearchQuery
            ? 'No data found.'
            : 'Exoplanets are planets outside of the solar system. Here you can query the NASA Exoplanet Archive and find the ones you love the most.'}
        </p>
      )}
    </>
  );
};

export default CsvTable;
