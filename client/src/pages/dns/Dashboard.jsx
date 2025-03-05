import React, { useEffect, useState } from "react";
import {
  CCard, CCardBody, CCol, CCardHeader, CRow, CSpinner,
  CFormInput, CButton, CTable, CTableBody, CTableHeaderCell,
  CTableRow, CTableDataCell, CTableHead
} from "@coreui/react";
import axios from "axios";
import "../../css/Zones.css";
import "../../css/Records.css";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const axiosInstance = axios.create({baseURL:ProcessingInstruction.env.REACT_APP_API_URL})

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Home = () => {
  const [zones, setZones] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loadingZones, setLoadingZones] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [error, setError] = useState(null);
  const [zoneId, setZoneId] = useState(null);
  const [zoneSearch, setZoneSearch] = useState("");
  const [recordSearch, setRecordSearch] = useState("");
  const [newZoneName, setNewZoneName] = useState("");

  const API_TOKEN = import.meta.env.VITE_API_TOKEN;
  const API_URL = "https://dns.enorde.com/api/v1";

  const debouncedZoneSearch = useDebounce(zoneSearch, 500);
  const debouncedRecordSearch = useDebounce(recordSearch, 500);

  const fetchZones = async () => {
    setError(null);
    try {
      const response = await axiosInstance.get(`${API_URL}/zones`, {
        headers: { "Authorization": `Bearer ${API_TOKEN}` },
      });
      setZones(response.data.zones);
      setFilteredZones(response.data.zones);
    } catch {
      setError("Failed to fetch zones");
    } finally {
      setLoadingZones(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, [API_TOKEN]);

  useEffect(() => {
    if (!zoneId) return;
    setLoadingRecords(true);
    setError(null);

    const fetchRecords = async () => {
      try {
        const response = await axiosInstance.get(`${API_URL}/records?zone_id=${zoneId}`, {
          headers: { "Authorization": `Bearer ${API_TOKEN}` },
        });
        setRecords(response.data.records);
        setFilteredRecords(response.data.records);
      } catch {
        setError("Failed to fetch records");
      } finally {
        setLoadingRecords(false);
      }
    };
    fetchRecords();
  }, [zoneId, API_TOKEN]);

  useEffect(() => {
    setFilteredZones(
      zones.filter((zone) =>
        zone.name.toLowerCase().includes(debouncedZoneSearch.toLowerCase())
      )
    );
  }, [debouncedZoneSearch, zones]);

  useEffect(() => {
    setFilteredRecords(
      records.filter((record) =>
        record.name.toLowerCase().includes(debouncedRecordSearch.toLowerCase())
      )
    );
  }, [debouncedRecordSearch, records]);

  return (
    <>
      <CButton color="secondary" onClick={fetchZones}>Refresh Zones</CButton>
      {!zoneId ? (
        <CRow>
          <CCol xs>
            <CCard className="mb-4 card-container">
              <CCardBody className="zones-container">
                {loadingZones ? <CSpinner color="info" /> : (
                  <CTable>
                    <CTableBody>
                      {filteredZones.map((zone) => (
                        <CTableRow key={zone.id} className="one-zones-container" onClick={() => setZoneId(zone.id)}>
                          <CTableDataCell>{zone.name}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      ) : (
        <CRow>
          <CCol xs>
            <CCard className="mb-4 card-container">
              <CCardHeader className="sticky-records">
                <span className="card-title">Records</span>
                <CFormInput
                  type="text"
                  placeholder="Search records..."
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  className="search-input"
                />
              </CCardHeader>
              <CCardBody className="records-container">
                {loadingRecords ? <CSpinner color="info" /> : (
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Value</CTableHeaderCell>
                        <CTableHeaderCell>TTL</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {filteredRecords.map((record) => (
                        <CTableRow key={record.id} className="one-record-container">
                          <CTableDataCell>{record.name}</CTableDataCell>
                          <CTableDataCell>{record.type}</CTableDataCell>
                          <CTableDataCell>{record.value}</CTableDataCell>
                          <CTableDataCell>{record.ttl}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  );
};

export default Home;
