import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getUrlApiWithPath } from "../utils/url_api";

/**
 * Hook for real-time data updates using polling
 * @param {string} endpoint - API endpoint to poll
 * @param {number} interval - Polling interval in milliseconds (default: 5000)
 * @param {Object} options - Additional options
 */
export const useRealtimeData = (endpoint, interval = 5000, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const intervalRef = useRef(null);
  const isActiveRef = useRef(true);

  const { transform = (data) => data, onUpdate = () => {}, dependencies = [], enabled = true } = options;

  const fetchData = async (showLoading = false) => {
    if (!enabled || !isActiveRef.current) return;

    try {
      if (showLoading) setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.get(getUrlApiWithPath(endpoint), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const transformedData = transform(response.data);

      // Check if data has actually changed to avoid unnecessary re-renders
      const dataStr = JSON.stringify(transformedData);
      const currentDataStr = JSON.stringify(data);

      if (dataStr !== currentDataStr) {
        setData(transformedData);

        // Only set lastUpdated if it's not the initial load
        if (!isInitialLoad) {
          setLastUpdated(new Date());
          onUpdate(transformedData);
        }
      }

      // Mark that initial load is complete
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      if (err.response?.status !== 401) {
        // Don't show error for auth issues
        setError(err.response?.data?.message || "Failed to fetch data");
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const startPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (enabled && interval > 0) {
      intervalRef.current = setInterval(() => fetchData(false), interval);
    }
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const refreshData = () => {
    fetchData(true);
  };

  const forceUpdate = () => {
    // This method forces an update notification on next data change
    setIsInitialLoad(false);
    fetchData(false);
  };

  useEffect(() => {
    isActiveRef.current = true;
    setIsInitialLoad(true); // Reset initial load flag
    fetchData(true);
    startPolling();

    return () => {
      isActiveRef.current = false;
      stopPolling();
    };
  }, [endpoint, interval, enabled, ...dependencies]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        fetchData(false);
        startPolling();
      }
    };

    const handleFocus = () => {
      fetchData(false);
      startPolling();
    };

    const handleBlur = () => {
      stopPolling();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return {
    data,
    loading,
    error,
    lastUpdated,
    isInitialLoad,
    refreshData,
    forceUpdate,
    stopPolling,
    startPolling,
  };
};

/**
 * Hook specifically for access requests with real-time updates
 */
export const useRealtimeAccessRequests = () => {
  return useRealtimeData("access-requests", 3000, {
    transform: (data) => (Array.isArray(data) ? data : []),
    onUpdate: (newData) => {
      console.log("Access requests updated:", newData.length, "items");
    },
  });
};

/**
 * Hook specifically for patient records with real-time updates
 */
export const useRealtimePatients = () => {
  return useRealtimeData("patients", 5000, {
    transform: (data) => (Array.isArray(data) ? data : []),
    onUpdate: (newData) => {
      console.log("Patient records updated:", newData.length, "items");
    },
  });
};

/**
 * Hook for doctor's own access requests
 */
export const useRealtimeMyAccessRequests = () => {
  return useRealtimeData("my-access-requests", 3000, {
    transform: (data) => (Array.isArray(data) ? data : []),
    onUpdate: (newData) => {
      console.log("My access requests updated:", newData.length, "items");
    },
  });
};
