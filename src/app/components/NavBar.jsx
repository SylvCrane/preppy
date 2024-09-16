import Link from 'next/link'

export default function NavBar() {
    return (
        <nav>
          <Link href="/">Home</Link>
          <Link href='/plangenerator'>Generate a Meal Plan</Link>
          <Link href='/recipeadder'>Add a recipe</Link>
          <Link href='/allrecipes'>All Recipes</Link>
        </nav>
     
        
    )
}