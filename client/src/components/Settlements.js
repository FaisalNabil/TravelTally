import React, { useState, useEffect } from 'react';

function Settlements({ tourId }) {
    const [settlements, setSettlements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch settlements from the backend
        fetch(`/api/tours/${tourId}/settlements`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setSettlements(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                setIsLoading(false);
            });
    }, [tourId]);

    if (isLoading) {
        return <p>Loading settlements...</p>;
    }

    if (settlements.length === 0) {
        return <p>No settlements to display.</p>;
    }

    return (
        <div>
            <h3>Settlements:</h3>
            <ul>
                {settlements.map((settlement, index) => (
                    <li key={index}>{`${settlement.fromMember.name} owes ${settlement.toMember.name} $${settlement.amount}`}</li>
                ))}
            </ul>
        </div>
    );
}

export default Settlements;
