import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

function Settlements({ tourId }) {
    const [settlements, setSettlements] = useState([]);
    const [individualExpenses, setIndividualExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
    
        Promise.all([
            fetch(`/api/tours/${tourId}/settlements`),
            fetch(`/api/tours/${tourId}/individualExpenses`)
        ])
        .then(async ([settlementsResponse, expensesResponse]) => {
            if (!settlementsResponse.ok) throw new Error('Error fetching settlements');
            if (!expensesResponse.ok) throw new Error('Error fetching individual expenses');
    
            const settlementsData = await settlementsResponse.json();
            const expensesData = await expensesResponse.json();
    
            setSettlements(settlementsData);
            setIndividualExpenses(expensesData);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [tourId]);
    

    if (isLoading) {
        return <p>Loading settlements...</p>;
    }

    if (settlements.length === 0) {
        return <p>No settlements to display.</p>;
    }

    if (individualExpenses.length === 0) {
        return <p>No individual expenses to display.</p>;
    }

    return (
        <Box>
            <div>
                <h3>Settlements:</h3>
                <ul>
                    {settlements.map((settlement, index) => (
                        <li key={index}>{`${settlement.fromMember.name} owes ${settlement.toMember.name} $${settlement.amount}`}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h3>Individual Expenses:</h3>
                <ul>
                    {individualExpenses.map((expense, index) => (
                        <li key={index}>
                            {`${expense.member.name} paid $${expense.paid} and should have paid $${expense.shouldHavePaid}`}
                        </li>
                    ))}
                </ul>
            </div>

        
        </Box>
    );
}

export default Settlements;
