function calculateBalances(tour) {
    let balances = {};
    let individualExpenses = {};

    // Initialize balances and individual expenses for each member
    tour.members.forEach(member => {
        const memberIdStr = member._id.toString();
        balances[memberIdStr] = { paid: 0, owes: 0, net: 0, name: member.name };
        individualExpenses[memberIdStr] = { paid: 0, shouldHavePaid: 0, name: member.name };
    });

    // Aggregate expenses and individual expenses
    tour.expenses.forEach(expense => {
        const payerId = expense.paidBy.memberId.toString();
        const amountPerMember = expense.amount / expense.involvedMembers.length;

        balances[payerId].paid += expense.amount;
        individualExpenses[payerId].paid += expense.amount;

        expense.involvedMembers.forEach(member => {
            const memberIdStr = member.memberId.toString();
            balances[memberIdStr].owes += amountPerMember;
            individualExpenses[memberIdStr].shouldHavePaid += amountPerMember;
        });
    });

    // Calculate net balance for each member
    for (const memberId in balances) {
        balances[memberId].net = balances[memberId].paid - balances[memberId].owes;
    }

    // Create settlements
    let settlements = [];
    for (const memberId in balances) {
        if (balances[memberId].net > 0) {
            for (const otherMemberId in balances) {
                if (balances[otherMemberId].net < 0) {
                    let settleAmount = Math.min(balances[memberId].net, -balances[otherMemberId].net);
                    if (settleAmount > 0) {
                        settlements.push({
                            from: { memberId: otherMemberId, name: balances[otherMemberId].name },
                            to: { memberId: memberId, name: balances[memberId].name },
                            amount: settleAmount
                        });
                        balances[memberId].net -= settleAmount;
                        balances[otherMemberId].net += settleAmount;
                    }
                }
            }
        }
    }
    
    return { settlements, individualExpenses };
}

module.exports = calculateBalances;
