~~1. connect to github~~

~~2. connect to vercel~~

3. Tailwind layout (dashboard)
 ~~a. nav bar~~
 ~~b. home page~~
 ~~c. (other) placeholder pages~~
    1. login page
    2. suggested recipes (seeded)
    3. recipe page
        a. top nav for overview (description, cook time, approximate cost, etc), ingredients, instructions, notes

~~4. add .env.local and add to git.ignore~~

~~5. connect postgres database~~

~~6. database models~~
 a. user model
 b. recipie model
 c. ingredient model
 d. implement userId to connect recipe to user
 e. position field for ingredients and steps
 f. connect all to database

~~7. setup Auth.js~~
 a. configure Auth.js
 b. account creation, login, logout
 c. hash passwords with bcryptjs

8. add recipe route protection (id)

9. build my recipes page
 a. show only owned recipes
 b. link to create recipe page

10. build create recipe form
 a. fields for name, url, ingredients, steps
 b. add and remove ingredient rows and instruction rows

11. create recipe server action
 a. validate form data with Zod
 b. save to database
 c. Use revalidatePath("/recipes")
 d. Use redirect("/recipes") after a successful save

12. build recipe details
 a. create route (/recipes/[id])
 b. display name, image, ingredient list, numbered instructions
 c. Use Next.js <Image> for the recipe picture.

13. build editing
 a. create /recipes/[id]/edit
 b. pre-fill form with saved recipe info
 c. add updateRecipe to server action
 d. verify that recipe belongs to logged-in user before update

14. add deletion
 a. add button to recipe and recipe detail page
 b. create server action
 c. verify ownership before deleting
 d. revalidate recipes and redirect after deletion

15. add error handling and polish
 a. show validation error for missing title, ingredients, steps
 b. add loading states and error pages
 c. add fonts
 d. verify desktop and mobile formats

16. more polishing  
make it so you dont need to login to access the site, just too be able to access your own recipes

tell users they are already logged in if they are logged in and click the login button

 sidenav import: import SideNav from "@/app/ui/dashboard/sidenav";