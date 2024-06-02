import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    
    const storedOptions = JSON.parse(localStorage.getItem("options"));
    const [options, setOptions] = useState(storedOptions || undefined);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          setData([]);
          const res = await axios.get(url);
          setData(res.data);
        } catch (err) {
          setError(err);
        }
        setLoading(false);
      };
      fetchData();
    }, [url]);
  
    const reFetch = async () => {
      setLoading(true);
      try {
        setData([]);
        const res = await axios.get(url);
        setData(res.data);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
  
    useEffect(() => {
      localStorage.setItem("options", JSON.stringify(options));
    }, [options]);
  
    return { data, loading, error, reFetch, options, setOptions };
  };

export default useFetch;