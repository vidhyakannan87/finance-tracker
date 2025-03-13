export enum SpendingCategory {
  ESSENTIALS = 'Essentials & Living Expenses',
  TRANSPORTATION = 'Transportation',
  DEBT = 'Debt & Financial Obligations',
  DINING = 'Dining & Entertainment',
  SHOPPING = 'Shopping & Personal Care',
  HEALTH = 'Health & Wellness',
  EDUCATION = 'Education & Professional Development',
  GIFTS = 'Gifts & Donations',
  HOME = 'Home & Maintenance',
  TRAVEL = 'Travel & Vacation',
  PETS = 'Pets',
  UNKNOWN = 'Unknown',
}

export const Subcategories: Record<SpendingCategory, string[]> = {
  [SpendingCategory.ESSENTIALS]: [
    'Rent',
    'Utilities',
    'Groceries',
    'Insurance',
  ],
  [SpendingCategory.TRANSPORTATION]: [
    'Fuel',
    'Public Transport',
    'Car Payment',
    'Tolls & Parking',
  ],
  [SpendingCategory.DEBT]: ['Loan Repayment', 'Credit Card', 'Taxes'],
  [SpendingCategory.DINING]: ['Restaurants', 'Takeout', 'Cafes'],
  [SpendingCategory.SHOPPING]: ['Clothing', 'Electronics', 'Beauty & Grooming'],
  [SpendingCategory.HEALTH]: ['Doctor Visits', 'Medications', 'Gym Membership'],
  [SpendingCategory.EDUCATION]: ['Tuition', 'Online Courses', 'Books'],
  [SpendingCategory.GIFTS]: ['Charitable Donations', 'Birthday Gifts'],
  [SpendingCategory.HOME]: ['Furniture', 'Repairs', 'Gardening'],
  [SpendingCategory.TRAVEL]: ['Flights', 'Hotels', 'Activities'],
  [SpendingCategory.PETS]: ['Vet Bills', 'Pet Food', 'Toys'],
  [SpendingCategory.UNKNOWN]: ['Unknown'],
};
