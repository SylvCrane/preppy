import RecipeList from "./recipelist";

export default function generator() {
    return (
        <main>
            <nav>
                <div>
                    <h2>Recipes</h2>
                    <p>Currently open recipes</p>
                </div>
            </nav>

            <RecipeList />
        </main>
    )
}