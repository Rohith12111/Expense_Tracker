## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/repo.git
cd repo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser



## Tech Stack

- **Framework:** React 18
- **State Management:** React Context + useReducer
- **UI Framework:** DaisyUI
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Utilities:** Lodash



## Project Structure

```
src/
├── components/          
│   ├── ExpenseManagement.jsx
│   ├── ExpenseTable.jsx
│   ├── NavBar.jsx
│   ├── Pagination.jsx
│   ├── TotalCostByCategory.jsx
│   ├── UserManagement.jsx
│   └── UserTable.jsx
├── contexts/           
│   └── AppContext.jsx
├── data/              # Mock data
│   └── mockData.js
├── App.jsx            
└── main.jsx          
```



# Expense Manager Technical Design Document

## 1. System Overview

 Expense Manager is a React-based web application designed to handle large-scale expense tracking across multiple users. The system allows for user management, expense tracking, and financial analytics with a focus on performance and scalability.

## 2. Data Models

### 2.1 User Model

```typescript
interface User {
    firstName: string;     // User's first name (2-50 chars)
    lastName: string;      // User's last name (2-50 chars)
    totalExpenses: number; // Pre-calculated sum of all user's expenses
}

// Stored in Map<string, User> where key is the userId (format: "u{UUID}")
```

### 2.2 Expense Model

```typescript
interface Expense {
    id: string;           // Unique identifier (format: "e{UUID}")
    userId: string;       // Reference to user (format: "u{UUID}")
    category: Category;   // Enum: "Meals" | "Travel" | "Software"
    description: string;  // Expense description (min 5 chars)
    cost: number;        // Expense amount (0 < cost ≤ 10,000,000)
}

// Stored in Array<Expense>
```

## 3. Time Complexity Analysis

### 3.1 User Operations

#### Create User
- Time Complexity: O(1)
- Implementation: Direct insertion into Users Map
- Key Operations:
  
  ```javascript
  newUsers.set(id, {
      firstName,
      lastName,
      totalExpenses: 0
  });
  ```

#### Read User
- Time Complexity: O(1)
- Implementation: Direct lookup from Users Map
- Key Operations:
  
  ```javascript
  const user = users.get(userId);
  ```

#### Update User
- Time Complexity: O(n) where n is number of expenses
- Implementation: Map update + expense table scan for name updates
- Key Operations:
  
  ```javascript
  // User update: O(1)
  newUsers.set(id, {
      ...currentUser,
      firstName,
      lastName
  });
  
  // Expense references update if needed: O(n)
  expenses.map(expense => /* update user references */);
  ```

#### Delete User
- Time Complexity: O(n) where n is number of expenses
- Implementation: Map deletion + expense filtering
- Key Operations:
 
  ```javascript
  // User deletion: O(1)
  newUsers.delete(id);
  
  // Related expense cleanup: O(n)
  expenses.filter(expense => expense.userId !== id)
  ```

### 3.2 Expense Operations

#### Create Expense
- Time Complexity: O(1)
- Implementation: Array insertion + User Map update
- Key Operations:
  
  ```javascript
  // Add expense: O(1)
  expenses.unshift(newExpense);
  
  // Update user total: O(1)
  newUsers.set(userId, {
      ...user,
      totalExpenses: user.totalExpenses + cost
  });
  ```

#### Read Expense
- Time Complexity: O(1) for single expense, O(n) for filtered list
- Implementation: Direct array access or array filtering
- Key Operations:
  
  ```javascript
  // Single expense: O(1)
  expenses.find(e => e.id === expenseId);
  
  // Filtered list: O(n)
  expenses.filter(expense => /* filter criteria */);
  ```

#### Update Expense
- Time Complexity: O(n)
- Implementation: Array scan + User Map updates
- Key Operations:
  
  ```javascript
  // Find and update expense: O(n)
  expenses.map(e => e.id === id ? newExpense : e);
  
  // Update user totals: O(1)
  newUsers.set(userId, {
      ...user,
      totalExpenses: user.totalExpenses + costDifference
  });
  ```

#### Delete Expense
- Time Complexity: O(n)
- Implementation: Array filtering + User Map update
- Key Operations:
  
  ```javascript
  // Remove expense: O(n)
  expenses.filter(expense => expense.id !== id);
  
  // Update user total: O(1)
  newUsers.set(userId, {
      ...user,
      totalExpenses: user.totalExpenses - cost
  });
  ```

## 4. Performance Optimizations

### 4.1 Data Structure Choices

1. **User Storage: Map vs Object/Array**
   - Chose: JavaScript Map
   - Benefits:
     - O(1) lookup, insertion, deletion
     - Better memory usage for large datasets
     - Native key iteration support
   
2. **Expense Storage: Array vs Map**
   - Chose: Array
   - Benefits:
     - Natural ordering for newest/oldest
     - Better for frequent iterations (filtering, mapping)
     - Simpler pagination implementation
   - Trade-offs:
     - O(n) for updates/deletes
     

### 4.2 State Management

1. **Pre-calculated Totals**
   - Implementation: Store total expenses in user object
   - O(1) access to user totals
   - No need to recalculate on every render

2. **Memoization Strategy**
     - Filtered expenses
     - Paginated results
     - Category totals
   - Benefits:
     - Prevents unnecessary recalculations
     - Smooth UI even with large datasets


### 4.3 UI Optimizations

1. **Pagination**
   - Implementation: Client-side pagination with configurable page size
   - Benefits:
     - Reduces DOM nodes
     - Improves rendering performance

2. **Debounced Search**
   - Implementation: 300ms debounce on search input
   - Benefits:
     - Reduces number of filter operations
     - Smoother user experience


## 5. Edge Cases Handled

1. **Data Validation**
   - Name length restrictions (2-50 characters)
   - Cost range validation (0 < cost ≤ 10,000,000)
   - Required field validation
   - Duplicate name handling

2. **User Experience**
   - Delete confirmation
   - Form error messages
   - Loading states
   - Empty state handling

3. **Data Integrity**
   - Consistent total updates
   - Cascade deletes
   - Currency precision handling
   - User reference maintenance

