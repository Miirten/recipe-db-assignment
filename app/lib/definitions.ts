export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
};

export type Recipe = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  cook_time_minutes: number | null;
  approximate_cost: number | null;
  servings: number | null;
  ingredients: string | null;
  instructions: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Ingredient = {
  id: string;
  recipe_id: string;
  name: string;
  quantity: string | null;
  unit: string | null;
  price: number | null;
  position: number;
  created_at: string;
  updated_at: string;
};

export type RecipeStep = {
  id: string;
  recipe_id: string;
  instruction: string;
  position: number;
  created_at: string;
  updated_at: string;
};