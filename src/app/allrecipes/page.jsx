"use client"

import PocketBase from 'pocketbase'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"

export default function RecipeList() {
    const router = useRouter()
    const [recipes, setRecipes] = useState(null)
    const [isLoading, setLoading] = useState(true)

    const pb = new PocketBase('https://recipe.pockethost.io/')
    pb.autoCancellation(false)

    useEffect(() => {
        async function fetchData() {
            const reciperecords = await pb.collection('recipes').getFullList({
                sort: '-created', expand: "ingredients"
            })
            setRecipes(reciperecords)
            setLoading(false)
        }

        fetchData()
    })

    const deleteRecipe = async (recipe) => {
        setLoading(true)

        const post = await pb.collection('recipes').delete(recipe.id)

        console.log('Recipe deleted', post)
        router.refresh()
      }


    if (isLoading) return <p>Loading</p>
    

        return (
            <>
            {Array.from(recipes.entries()).map(([id, recipe]) => (
                <div key={id} className="card my-5">
                    <button className = "btn-primary" onClick={() => deleteRecipe(recipe)}>Delete Recipe</button>
                    <h3>{recipe.title}</h3>
                    {recipe.expand.ingredients.map(ingredients => (
                        <div key = {ingredients.id}>
                            <p>{ingredients.ingredient}</p>
                        </div>
                    ))}
                    <h3>{recipe.instructions}</h3>
                    <Link href={`allrecipes/${recipe.id}`}>Update Recipe</Link>
                </div>
            ))}   
            </>
        )
    
}