#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <queue>
#include <sstream>

// This header is required to "bind" our C++ function to JavaScript
#include <emscripten/bind.h>

// Your comparator structs (no changes needed)
struct cmpMin {
    bool operator()(const std::pair<std::string, int>& a, const std::pair<std::string, int>& b) const {
        return a.second > b.second;
    }
};

struct cmpMax {
    bool operator()(const std::pair<std::string, int>& a, const std::pair<std::string, int>& b) const {
        return a.second < b.second;
    }
};

// This is the function that JavaScript will call
std::string minimize_transactions(const std::string& transactions_str) {
    std::map<std::string, int> net_balance;
    std::stringstream ss(transactions_str);
    std::string payer, payee, amount_str;

    // Parse the input string (e.g., "A,B,10;C,A,20;")
    while (std::getline(ss, payer, ',') && std::getline(ss, payee, ',') && std::getline(ss, amount_str, ';')) {
        int amount = std::stoi(amount_str);
        net_balance[payer] -= amount;
        net_balance[payee] += amount;
    }

    // Your heap logic (no changes needed)
    std::priority_queue<std::pair<std::string, int>, std::vector<std::pair<std::string, int>>, cmpMax> creditors;
    std::priority_queue<std::pair<std::string, int>, std::vector<std::pair<std::string, int>>, cmpMin> debitors;

    for (const auto& p : net_balance) {
        if (p.second < 0) {
            debitors.push(p);
        } else if (p.second > 0) {
            creditors.push(p);
        }
    }

    std::stringstream result_ss;
    while (!creditors.empty() && !debitors.empty()) {
        auto high = creditors.top();
        auto low = debitors.top();
        creditors.pop();
        debitors.pop();

        int settlement_amount = std::min(-low.second, high.second);
        
        // Format the result as a string: "Debtor,Creditor,Amount;"
        result_ss << low.first << "," << high.first << "," << settlement_amount << ";";

        high.second -= settlement_amount;
        low.second += settlement_amount;

        if (high.second != 0) {
            creditors.push(high);
        }
        if (low.second != 0) {
            debitors.push(low);
        }
    }

    return result_ss.str();
}

// This line "exports" our C++ function so JavaScript can see it.
EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("minimizeTransactions", &minimize_transactions);
}