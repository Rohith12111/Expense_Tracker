import { createContext, useContext, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';


const AppStateContext = createContext(undefined);
const AppDispatchContext = createContext(undefined);


const ACTIONS = {
    ADD_USER: 'ADD_USER',
    UPDATE_USER: 'UPDATE_USER',
    DELETE_USER: 'DELETE_USER',
    ADD_EXPENSE: 'ADD_EXPENSE',
    UPDATE_EXPENSE: 'UPDATE_EXPENSE',
    DELETE_EXPENSE: 'DELETE_EXPENSE'
};


function appReducer(state, action) {
    switch (action.type) {
        case ACTIONS.ADD_USER: {
            const { id, firstName, lastName } = action.payload;
            const newUsers = new Map(state.users);
            newUsers.set(id, {
                firstName,
                lastName,
                totalExpenses: 0
            });
            
            return {
                ...state,
                users: newUsers
            };
        }

        case ACTIONS.UPDATE_USER: {
            const { id, firstName, lastName } = action.payload;
            const newUsers = new Map(state.users);
            const currentUser = newUsers.get(id);
            newUsers.set(id, {
                ...currentUser,
                firstName,
                lastName
            });
            
            return {
                ...state,
                users: newUsers
            };
        }

        case ACTIONS.DELETE_USER: {
            const { id } = action.payload;
            const newUsers = new Map(state.users);
            newUsers.delete(id);
            
            return {
                ...state,
                users: newUsers,
                expenses: state.expenses.filter(expense => expense.userId !== id)
            };
        }

        case ACTIONS.ADD_EXPENSE: {
            const { expense } = action.payload;
            const newUsers = new Map(state.users);
            const user = newUsers.get(expense.userId);
            newUsers.set(expense.userId, {
                ...user,
                totalExpenses: Number((user.totalExpenses + expense.cost).toFixed(2))
            });

            return {
                ...state,
                users: newUsers,
                expenses: [expense, ...state.expenses]
            };
        }

        case ACTIONS.UPDATE_EXPENSE: {
            const { id, newExpense, oldExpense } = action.payload;
            const newUsers = new Map(state.users);

           
            if (newExpense.userId === oldExpense.userId) {
                
                const user = newUsers.get(newExpense.userId);
                newUsers.set(newExpense.userId, {
                    ...user,
                    totalExpenses: Number((user.totalExpenses - oldExpense.cost + newExpense.cost).toFixed(2))
                });
            } else {
                
                const oldUser = newUsers.get(oldExpense.userId);
                const newUser = newUsers.get(newExpense.userId);
                newUsers.set(oldExpense.userId, {
                    ...oldUser,
                    totalExpenses: Number((oldUser.totalExpenses - oldExpense.cost).toFixed(2))
                });
                newUsers.set(newExpense.userId, {
                    ...newUser,
                    totalExpenses: Number((newUser.totalExpenses + newExpense.cost).toFixed(2))
                });
            }

            return {
                ...state,
                users: newUsers,
                expenses: state.expenses.map(e => e.id === id ? newExpense : e)
            };
        }

        case ACTIONS.DELETE_EXPENSE: {
            const { id, expense } = action.payload;
            const newUsers = new Map(state.users);
            const user = newUsers.get(expense.userId);
            newUsers.set(expense.userId, {
                ...user,
                totalExpenses: Number((user.totalExpenses - expense.cost).toFixed(2))
            });

            return {
                ...state,
                users: newUsers,
                expenses: state.expenses.filter(e => e.id !== id)
            };
        }

        default:
            return state;
    }
}

const appActions = {
    addUser: (firstName, lastName) => ({
        type: ACTIONS.ADD_USER,
        payload: {
            id: `u${crypto.randomUUID()}`,
            firstName,
            lastName
        }
    }),
    
    updateUser: (id, firstName, lastName) => ({
        type: ACTIONS.UPDATE_USER,
        payload: { id, firstName, lastName }
    }),
    
    deleteUser: (id) => ({
        type: ACTIONS.DELETE_USER,
        payload: { id }
    }),
    
    addExpense: (userId, category, description, cost) => ({
        type: ACTIONS.ADD_EXPENSE,
        payload: {
            expense: {
                id: `e${crypto.randomUUID()}`,
                userId,
                category,
                description,
                cost: Number(cost)
            }
        }
    }),
    
    updateExpense: (id, newData, oldExpense) => ({
        type: ACTIONS.UPDATE_EXPENSE,
        payload: {
            id,
            newExpense: {
                id,
                ...newData,
                cost: Number(newData.cost)
            },
            oldExpense
        }
    }),
    
    deleteExpense: (id, expense) => ({
        type: ACTIONS.DELETE_EXPENSE,
        payload: { id, expense }
    })
};


export {
    AppProvider,
    useAppState,
    useAppDispatch,
    appActions
};

function useAppState() {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppProvider');
    }
    return context;
}

function useAppDispatch() {
    const context = useContext(AppDispatchContext);
    if (context === undefined) {
        throw new Error('useAppDispatch must be used within an AppProvider');
    }
    return context;
}


function AppProvider({ children, initialUsers, initialExpenses }) {
    
    const [state, dispatch] = useReducer(appReducer, {
        users: initialUsers || new Map(),
        expenses: initialExpenses || []
    });
    
    const value = useMemo(() => ({
        users: state.users,
        expenses: state.expenses
    }), [state.users, state.expenses]);
    
    return (
        <AppStateContext.Provider value={value}>
            <AppDispatchContext.Provider value={dispatch}>
                {children}
            </AppDispatchContext.Provider>
        </AppStateContext.Provider>
    );
}

AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
    initialUsers: PropTypes.instanceOf(Map),
    initialExpenses: PropTypes.array
};