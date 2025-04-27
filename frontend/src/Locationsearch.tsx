import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationSearch = ({ onLocationSelect }) => {
    const [city, setCity] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchSuggestions = async (query) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get("https://nominatim.openstreetmap.org/search", {
                params: { format: "json", q: query },
            });

            const data = response.data;
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
        const delayDebounce = setTimeout(() => fetchSuggestions(city), 300);
        return () => clearTimeout(delayDebounce);
    }, [city]);

    const handleSelectLocation = (location) => {
        setLocation(location);
        setCity(location.name);
        setSuggestions([]);
        if (onLocationSelect) {
            onLocationSelect(location);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f6', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h3 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>Search Location</h3>

            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter Location"
                style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
            />
            {suggestions.length > 0 && !loading && (
                <ul style={{ listStyleType: 'none', padding: '0', margin: '0', textAlign: 'left', border: '1px solid #ddd', backgroundColor: '#fff', borderRadius: '4px', position: 'absolute', width: '100%' }}>
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSelectLocation(suggestion)} style={{ padding: '10px', cursor: 'pointer' }}>
                            {suggestion.name}
                        </li>
                    ))}
                </ul>
            )}

            {location && (
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e9f7fc', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>Selected Location:</h4>
                    <p style={{ fontSize: '16px', color: '#333' }}>{location.name} (Lat: {location.lat}, Lon: {location.lon})</p>
                </div>
            )}
        </div>
    );
};

export default LocationSearch;