const { aggregate } = require("../models/Tour");

function calculateBalances(tour) {
    let balances = {};
    let individualExpenses = {};

    // Initialize balances for each member
    tour.members.forEach(member => {
        balances[member._id.toString()] = { paid: 0, owes: 0, name: member.name };
        individualExpenses[member._id.toString()] = { paid: 0, shouldHavePaid: 0, name: member.name };
    });

    // Aggregate expenses
    tour.expenses.forEach(expense => {
        const payerId = expense.paidBy.memberId.toString();
        balances[payerId].paid += expense.amount;
        individualExpenses[payerId].paid += expense.amount;

        // Divide the expense amount among involved members
        const amountPerMember = expense.amount / expense.involvedMembers.length;
        expense.involvedMembers.forEach(member => {
            const memberIdStr = member.memberId.toString();
            balances[memberIdStr].owes += amountPerMember;
            individualExpenses[memberIdStr].shouldHavePaid += amountPerMember;
        });
    });
    
    // Calculate total expense per member
    for (const memberId in balances) {
        balances[memberId].owes -= balances[memberId].paid;
    }

    // Create arrays for members who owe and are owed
    let oweArray = [], owedArray = [];
    for (const memberId in balances) {
        if (balances[memberId].owes > 0) {
            owedArray.push({ memberId, amount: balances[memberId].owes, name: balances[memberId].name });
        } else if (balances[memberId].owes < 0) {
            oweArray.push({ memberId, amount: -balances[memberId].owes, name: balances[memberId].name });
        }
    }

    // Sort the arrays: highest amounts first
    oweArray.sort((a, b) => b.amount - a.amount);
    owedArray.sort((a, b) => b.amount - a.amount);

    // Match settlements
    let settlements = [];
    while (oweArray.length > 0 && owedArray.length > 0) {
        const owe = oweArray[0];
        const owed = owedArray[0];
        const amount = Math.min(owe.amount, owed.amount);

        settlements.push({
            from: { memberId: owed.memberId, name: owed.name },
            to: { memberId: owe.memberId, name: owe.name },
            amount
        });

        // Update the amounts
        owe.amount -= amount;
        owed.amount -= amount;

        // Remove the member from the array if their balance is settled
        if (owe.amount === 0) oweArray.shift();
        if (owed.amount === 0) owedArray.shift();
    }
    
    return { settlements, individualExpenses };
}

module.exports = calculateBalances;
