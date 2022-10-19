import { range } from 'https://cdn.skypack.dev/lodash-es?dts';

type YearlyMoney = {
    income: number,
    expense: number,
    retained: number,
};

const printYears = (years: YearlyMoney[]) => {
    console.log(`Year\tIncome\tExpense\tRetained`);
    years.forEach((year, i) => {
        i = i + 1;
        console.log(`${i}\t${noDecimal(year.income)}\t${noDecimal(year.expense)}\t${noDecimal(year.retained)}`);
    });
};

const noDecimal = (x: number): string => x.toFixed(0);

const yearlyMoney = (monthlyIncome: number, monthlyCostOfLiving: number): YearlyMoney => {
    const monthlySurplus = monthlyIncome - monthlyCostOfLiving;
    return {
        income: monthlyIncome * 12,
        expense: monthlyCostOfLiving * 12,
        retained: monthlySurplus * 12,
    };
};

const hike = (percentageIncreasePerYear: number) => (previous: number): number => {
    return previous + (percentageIncreasePerYear / 100) * previous;
};

const main = () => {
    const numYears = 20;
    const initialMonthlyIncome = 50000;
    const initialMonthlyCostOfLiving = 30000;
    const salaryHike = hike(10);
    const costOfLivingIncrease = hike(8);

    let prevMonthlyIncome = initialMonthlyIncome;
    let prevMonthlyCostOfLiving = initialMonthlyCostOfLiving;
    const years = [
        yearlyMoney(initialMonthlyIncome, initialMonthlyCostOfLiving)
    ];
    for (const _ of range(numYears - 1)) {
        const monthlyIncome = salaryHike(prevMonthlyIncome);
        const monthlyCostOfLiving = costOfLivingIncrease(prevMonthlyCostOfLiving);

        const currentYearMoney = yearlyMoney(monthlyIncome, monthlyCostOfLiving);
        years.push(currentYearMoney);

        prevMonthlyIncome = monthlyIncome;
        prevMonthlyCostOfLiving = monthlyCostOfLiving;
    }

    printYears(years);
};

main();
