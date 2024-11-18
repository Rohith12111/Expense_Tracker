import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartPie, Receipt, ArrowRight, DollarSign } from "lucide-react";
import { useAppState } from '../contexts/AppContext';

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1"];
const CATEGORIES = ["Meals", "Travel", "Software"];

const EmptyStateContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl lg:col-span-2">
            <div className="card-body items-center text-center py-12">
                <Receipt className="w-16 h-16 text-base-content/20 mb-4" />
                <h3 className="card-title text-xl mb-2">No Expenses Recorded</h3>
                <p className="text-base-content/60 mb-6">
                    Track your spending across different categories
                </p>

                <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mb-8">
                    {CATEGORIES.map((category, index) => (
                        <div 
                            key={category} 
                            className="flex flex-col items-center p-4 rounded-lg border border-base-300"
                        >
                            <div 
                                className="w-8 h-8 rounded-full mb-2 flex items-center justify-center"
                                style={{ backgroundColor: COLORS[index] }}
                            >
                                <DollarSign className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium">{category}</span>
                            <span className="text-xs text-base-content/60">$0.00</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-base-content/60">
                        <span className="badge badge-ghost">Create a User</span>
                        <ArrowRight className="w-4 h-4" />
                        <span className="badge badge-ghost">Add Expenses</span>
                        <ArrowRight className="w-4 h-4" />
                        <span className="badge badge-ghost">View Summary</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TotalCostByCategory = () => {
    
    const { expenses } = useAppState();

    
    const { totalsByCategory, totalExpenses, chartData } = useMemo(() => {
        
        const totals = expenses.reduce((acc, expense) => {
            acc[expense.category] = Number((acc[expense.category] || 0) + expense.cost);
            return acc;
        }, {});

        
        const total = Object.values(totals).reduce(
            (a, b) => a + Number(b),
            0
        );

       
        const data = CATEGORIES.map((category, index) => ({
            name: category,
            value: Number(totals[category]) || 0,
            color: COLORS[index],
        }));

        return {
            totalsByCategory: totals,
            totalExpenses: total,
            chartData: data
        };
    }, [expenses]);

    
    const CategoryBreakdown = useMemo(() => (
        <div className="space-y-4">
            {CATEGORIES.map((category, index) => {
                const amount = totalsByCategory[category] || 0;
                const percentage = totalExpenses > 0
                    ? (amount / totalExpenses) * 100
                    : 0;

                return (
                    <div key={category}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">
                                {category}
                            </span>
                            <div className="text-sm space-x-2">
                                <span>
                                    ${Number(amount).toFixed(2)}
                                </span>
                                <span className="text-base-content/60">
                                    ({percentage.toFixed(1)}%)
                                </span>
                            </div>
                        </div>
                        <div className="w-full bg-base-300 rounded-full h-2.5">
                            <div
                                className="h-2.5 rounded-full transition-all duration-300"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: COLORS[index],
                                }}
                            ></div>
                        </div>
                    </div>
                );
            })}
        </div>
    ), [totalsByCategory, totalExpenses]);

    const CategoryLegend = useMemo(() => (
        <div className="flex justify-center gap-4 mt-4">
            {CATEGORIES.map((category, index) => (
                <div
                    key={category}
                    className="flex items-center gap-2"
                >
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{
                            backgroundColor: COLORS[index],
                        }}
                    ></div>
                    <span className="text-sm">{category}</span>
                </div>
            ))}
        </div>
    ), []);

    if (!expenses.length) {
        return (
            <div className="p-4 max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ChartPie className="w-6 h-6" />
                        <h2 className="text-2xl font-bold">Expense Summary</h2>
                    </div>
                    <div className="badge badge-neutral">
                        Total: $0.00
                    </div>
                </div>
                <EmptyStateContent />
            </div>
        );
    }

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <ChartPie className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Expense Summary</h2>
                </div>
                <div className="badge badge-neutral">
                    Total: ${totalExpenses.toFixed(2)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title">Expense Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        animationDuration={300}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "var(--fallback-b1,oklch(var(--b1)))",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            color: "var(--fallback-bc,oklch(var(--bc)))",
                                        }}
                                        formatter={(value) => `$${value.toFixed(2)}`}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {CategoryLegend}
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title">Category Breakdown</h3>
                        {CategoryBreakdown}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalCostByCategory;