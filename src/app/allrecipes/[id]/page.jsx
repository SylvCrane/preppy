"use client"

import PocketBase from 'pocketbase'
import { useRouter } from "next/navigation"
import { useState, useEffect } from 'react';

export default function RecipeDetails({ params }) {
    const id = params.id
    const router = useRouter()
    const [recipe, setRecipe] = useState(null)
    const [isLoading, setLoading] = useState(true)

    const [title, setTitle] = useState('')
    const [ingredients, setIngredients] = useState([{
        ingredient: ''
    }])
    const [instructions, setInstructions] = useState('')

    const pb = new PocketBase('https://recipe.pockethost.io/')
    pb.autoCancellation(false)

    useEffect(() => {
        async function fetchData() {
            const reciperecords = await pb.collection('recipes').getOne(params.id, {
                sort: '-created', expand: "ingredients"
            })
            setRecipe(reciperecords)
            setTitle(reciperecords.title)
            setInstructions(reciperecords.instructions)

            let ingredients = []

            for (let i = 0; i < reciperecords.expand.ingredients.length; i++)
            {
                ingredients.push({ ingredient: reciperecords.expand.ingredients[i].ingredient})
            }

            setIngredients(ingredients)
            
            setLoading(false)

            
        }

        fetchData()
    }, [id])

    const handleIngredientsChange = (index, e) => {
        const newIngredients = [...ingredients]

        newIngredients[index].ingredient = e.target.value
        setIngredients(newIngredients)
    }

    const addNewIngredientField = () => {
        setIngredients([...ingredients, {ingredient: ''}])
    };

    const removeIngredientField = index => {
        const list = [...ingredients];
        list.splice(index, 1);
        setIngredients(list);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        let ingredientID = []
        try {
            for(let i = 0; i < ingredients.length; i++)
            {
                const post = await pb.collection('ingredients').create({
                    'ingredient': ingredients[i].ingredient
                })

                if (post && post.id)
                {
                    ingredientID.push(post.id)
                }
            }

            const updatedRecipe = {
                "title": title,
                "instructions": instructions,
                "ingredients": ingredientID
            }

            const post = await pb.collection('recipes').update(recipe.id, updatedRecipe)

            if (post && post.id) 
            {
                console.log('Recipe added', post)
                router.refresh()
                router.push('/allrecipes')
            }
            else
            {
                console.log('The submission was not successful due to missing an ID')
            }
        }
        catch (error)
        {
            console.error('Error creating post', error)
        }
      }

    if (isLoading) return <p>Loading</p>

    if (!isLoading)
    {
        return (
            <>
            <form className="w-1/2" onSubmit={handleSubmit}>
                <label>
                    <span>Title:</span>
                    <input
                        required
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title} />
                </label>
                <label>
                    <span>Ingredients:</span>
                    {ingredients.map((ingredient, index) => (
                        <div key={index}>
                            <input
                                required
                                type="text"
                                onChange={(e) => handleIngredientsChange(index, e)}
                                value={ingredient.ingredient} />
                            <button className="btn-primary" type="button" onClick={() => removeIngredientField(ingredients)}>Remove Ingredient</button>
                        </div>

                    ))}
                </label>
                <button className="btn-primary" type="button" onClick={addNewIngredientField}>Add Ingredient</button>
                <label>
                    <span>Instructions:</span>
                    <input
                        required
                        type="text"
                        onChange={(e) => setInstructions(e.target.value)}
                        value={instructions} />
                </label>

                <button
                    className="btn-primary"
                    disabled={isLoading}
                >
                    {isLoading && <span>Updating...</span>}
                    {!isLoading && <span>Update Recipe</span>}
                </button>
            </form></>
        )
    }
    

}