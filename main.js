// --- 1. SETUP ---
const container = document.getElementById('graph-container');
const form = document.getElementById('transaction-form');
const transactionsList = document.getElementById('transactions-list');
const simplifyBtn = document.getElementById('simplify-btn');
const statusElement = document.getElementById('status');

// Vis.js data structures
const nodes = new vis.DataSet([]);
const edges = new vis.DataSet([]);
const data = { nodes: nodes, edges: edges };
const options = {
    edges: {
        arrows: { to: { enabled: true, scaleFactor: 1 } },
        font: { align: 'top', size: 14 },
        width: 2
    },
    nodes: {
        shape: 'dot', size: 25, font: { size: 16 }
    }
};
const network = new vis.Network(container, data, options);

// Store transactions in an array
let transactions = [];

// --- 2. WEB ASSEMBLY INITIALIZATION ---
var Module = {
  onRuntimeInitialized: function() {
    console.log("WebAssembly module has been loaded.");
    statusElement.textContent = "Ready!";
    simplifyBtn.disabled = false;
    simplifyBtn.textContent = "Simplify Debts";
  }
};

// --- 3. EVENT LISTENERS ---
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const payerName = document.getElementById('payer').value.trim();
    const amount = parseInt(document.getElementById('amount').value);
    const payeeName = document.getElementById('payee').value.trim();
    if (!payerName || !payeeName || !amount) return;

    if (simplifyBtn.textContent === "Reset") {
        transactions = [];
        simplifyBtn.textContent = "Simplify Debts";
    }
    
    transactions.push({ payer: payerName, payee: payeeName, amount: amount });
    updateGraph(transactions);
    updateTransactionList();
    form.reset();
});

simplifyBtn.addEventListener('click', () => {
    if (simplifyBtn.textContent === "Reset") {
        transactions = [];
        updateGraph([]);
        updateTransactionList();
        simplifyBtn.textContent = "Simplify Debts";
        return;
    }

    let transaction_str = "";
    for (const t of transactions) {
        transaction_str += `${t.payer},${t.payee},${t.amount};`;
    }

    const result_str = Module.minimizeTransactions(transaction_str);
    
    const simplified_transactions = [];
    const result_parts = result_str.split(';').filter(t => t);
    
    transactionsList.innerHTML = '<li>--- Simplified Transactions ---</li>';
    
    for (const t of result_parts) {
        const [debtor, creditor, amount] = t.split(',');
        // For simplified transactions, the "payer" is the debtor
        simplified_transactions.push({ payer: debtor, payee: creditor, amount: amount });
        const listItem = document.createElement('li');
        listItem.textContent = `➡️ ${debtor} pays ${amount} to ${creditor}`;
        transactionsList.appendChild(listItem);
    }
    
    updateGraph(simplified_transactions, true);
    simplifyBtn.textContent = "Reset";
});

// --- 4. HELPER FUNCTIONS ---
function updateGraph(transactionList, isSimplified = false) {
    const people = new Set();
    transactionList.forEach(t => { people.add(t.payer); people.add(t.payee); });
    nodes.clear();
    edges.clear();
    people.forEach(p => nodes.add({ id: p, label: p }));
    
    transactionList.forEach(t => {
        // *** THIS IS THE FIX ***
        // If it's an initial transaction, the payee owes the payer. Arrow: payee -> payer
        // If it's a simplified transaction, the debtor (t.payer) pays the creditor (t.payee). Arrow: payer -> payee
        const fromNode = isSimplified ? t.payer : t.payee;
        const toNode   = isSimplified ? t.payee : t.payer;

        edges.add({
            from: fromNode, 
            to: toNode, 
            label: String(t.amount),
            color: isSimplified ? '#E53E3E' : '#4CAF50',
            width: isSimplified ? 3 : 2
        });
    });
}

function updateTransactionList() {
    transactionsList.innerHTML = '';
    transactions.forEach(t => {
        const listItem = document.createElement('li');
        listItem.textContent = `${t.payer} paid ${t.amount} for ${t.payee}`;
        transactionsList.appendChild(listItem);
    });
}