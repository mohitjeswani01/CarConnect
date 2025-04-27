import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationSearch = ({ onLocationSelect }) => {
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [fromLocation, setFromLocation] = useState(null);
    const [toLocation, setToLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchSuggestions = async (query, setSuggestions) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get("https://nominatim.openstreetmap.org/search", {
                params: { format: "json", q: query },
            });

            const data = response.data as { display_name: string; lat: string; lon: string }[];

            setSuggestions(data.map((place) => ({
                name: place.display_name,
                lat: place.lat,
                lon: place.lon
            })));
        } catch (error) {
            console.error("Error fetching location data:", error);
            setSuggestions([]);
        }
        setLoading(false);

    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => fetchSuggestions(fromCity, setFromSuggestions), 300);
        return () => clearTimeout(delayDebounce);
    }, [fromCity]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => fetchSuggestions(toCity, setToSuggestions), 300);
        return () => clearTimeout(delayDebounce);
    }, [toCity]);

    const handleSelectLocation = (location, type) => {
        if (type === 'from') {
            setFromLocation(location);
            setFromCity(location.name);
            setFromSuggestions([]);
        } else {
            setToLocation(location);
            setToCity(location.name);
            setToSuggestions([]);
        }

        if (onLocationSelect) {
            onLocationSelect({ from: { ...fromLocation, ...location }, to: { ...toLocation, ...location } });
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h3 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>Search Locations</h3>

            {/* From Location Input */}
            <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="Enter From Location"
                style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
            />
            {fromSuggestions.length > 0 && !loading && (
                <ul style={{ listStyleType: 'none', padding: '0', margin: '0', textAlign: 'left', border: '1px solid #ddd', backgroundColor: '#fff', borderRadius: '4px', position: 'absolute', width: '100%' }}>
                    {fromSuggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSelectLocation(suggestion, 'from')} style={{ padding: '10px', cursor: 'pointer' }}>{suggestion.name}</li>
                    ))}
                </ul>
            )}

            {/* To Location Input */}
            <input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder="Enter To Location"
                style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
            />
            {toSuggestions.length > 0 && !loading && (
                <ul style={{ listStyleType: 'none', padding: '0', margin: '0', textAlign: 'left', border: '1px solid #ddd', backgroundColor: '#fff', borderRadius: '4px', position: 'absolute', width: '100%' }}>
                    {toSuggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSelectLocation(suggestion, 'to')} style={{ padding: '10px', cursor: 'pointer' }}>{suggestion.name}</li>
                    ))}
                </ul>
            )}

            {/* Show Selected Locations */}
            {(fromLocation || toLocation) && (
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e9f7fc', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>Selected Locations:</h4>
                    {fromLocation && <p style={{ fontSize: '16px', color: '#333' }}>From: {fromLocation.name} (Lat: {fromLocation.lat}, Lon: {fromLocation.lon})</p>}
                    {toLocation && <p style={{ fontSize: '16px', color: '#333' }}>To: {toLocation.name} (Lat: {toLocation.lat}, Lon: {toLocation.lon})</p>}
                </div>
            )}
        </div>
    );
};

export default LocationSearch;
