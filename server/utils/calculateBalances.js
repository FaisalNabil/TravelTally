function calculateBalances(tour) {
    let totalSpent = 0;
    const balances = {};
    const settlements = [];

    // Initialize balances
    tour.members.forEach(member => {
        balances[member._id] = { paid: 0, owes: 0, name: member.name };
    });
    console.log(balances);

    // Aggregate expenses
    tour.expenses.forEach(expense => {
        if (expense.paidBy && expense.paidBy.memberId) {
            console.log(expense.paidBy);
            balances[expense.paidBy.memberId].paid += expense.amount;
            totalSpent += expense.amount;
        }
    });

    const averageExpense = totalSpent / tour.members.length;

    // Calculate how much each member owes or is owed
    for (const memberId in balances) {
        balances[memberId].owes = averageExpense - balances[memberId].paid;
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

    return settlements;
}

module.exports = calculateBalances;
