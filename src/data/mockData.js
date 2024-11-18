const firstNames = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
    "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
    "Emma", "Olivia", "Noah", "Liam", "Sophia", "Ava", "Isabella", "Mia", "Charlotte", "Amelia",
    "Harper", "Evelyn", "Mason", "Logan", "Lucas", "Aiden", "Ethan", "Alexander", "Henry", "Sebastian",
    "Daniel", "Matthew", "Samuel", "Christopher", "Andrew", "Benjamin", "Nicholas", "Nathan", "Anthony", "Joshua",
    "Ryan", "Kevin", "Justin", "Brandon", "Eric", "Steven", "Timothy", "Aaron", "Adam", "Brian",
    "Alice", "Julia", "Victoria", "Grace", "Emily", "Sophie", "Zoe", "Hannah", "Natalie", "Rachel",
    "Lily", "Samantha", "Anna", "Eva", "Madison", "Katherine", "Ashley", "Alexis", "Chloe", "Abigail",
    "Oliver", "Jack", "Harry", "George", "Leo", "Arthur", "Charlie", "Oscar", "Gabriel", "Muhammad",
    "Caroline", "Maria", "Sofia", "Scarlett", "Eleanor", "Maya", "Lucy", "Amy", "Nora", "Elena",
    "Mateo", "Isaac", "Luke", "Carter", "Dylan", "Jayden", "Wyatt", "Jordan", "Adrian", "Ian"
];

const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans",
    "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales",
    "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed",
    "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks", "Chavez",
    "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes", "Price", "Alvarez", "Castillo",
    "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez", "Powell", "Jenkins", "Perry",
    "Russell", "Sullivan", "Bell", "Coleman", "Butler", "Henderson", "Barnes", "Gonzales", "Fisher", "Vasquez"
];


const expenseDescriptions = {
    "Meals": ["Lunch with clients", "Catering for workshop", "Dinner with stakeholders", "Breakfast meeting", "Team dinner", "Coffee supplies", "Team lunch", "Weekly groceries for office", "Catering for event", "Monthly kitchen supplies"],
    "Travel": ["Flight to Seattle", "Hotel booking", "Car rental", "Train tickets", "Uber rides", "Local bus tickets", "Airbnb for retreat", "Bike rental", "Conference flights", "Train tickets"],
    "Software": ["Zoom subscription", "Jira license", "Adobe subscription", "Slack Premium", "AWS services", "Google Workspace", "VS Code extensions", "Trello subscription", "Custom plugins", "Figma annual subscription"]
};

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const generateRandomAmount = (min, max) => Number((Math.random() * (max - min) + min).toFixed(2));

const generateUsersAndExpenses = (userCount = 5000, expensesPerUser = 3) => {
    const userMap = new Map();
    const expenses = [];
    const usedCombinations = new Set();
    const categories = ["Meals", "Travel", "Software"];
    let expenseId = 1;

    for (let userId = 1; userId <= userCount; userId++) {
        const userIdString = `u${userId}`;
        
        
        let firstName, lastName, combination;
        do {
            firstName = getRandomElement(firstNames);
            lastName = getRandomElement(lastNames);
            combination = `${firstName}-${lastName}`;
        } while (usedCombinations.has(combination));
        usedCombinations.add(combination);

       
        let userTotalExpenses = 0;
        for (let i = 0; i < expensesPerUser; i++) {
            const category = getRandomElement(categories);
            const cost = generateRandomAmount(50, 1000);
            userTotalExpenses += cost;
            
            expenses.push({
                id: `e${expenseId++}`,
                userId: userIdString,
                category,
                description: getRandomElement(expenseDescriptions[category]),
                cost
            });
        }

       
        userMap.set(userIdString, {
            firstName,
            lastName,
            totalExpenses: Number(userTotalExpenses.toFixed(2))
        });
    }

    return { userMap, expenses };
};

const { userMap, expenses } = generateUsersAndExpenses(5000);

export const mockUsers = userMap;
export const mockExpenses = expenses;

